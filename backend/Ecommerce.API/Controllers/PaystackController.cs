using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Ecommerce.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/paystack")]
public class PaystackController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ApplicationDbContext _context;

    public PaystackController(
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        ApplicationDbContext context)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _context = context;
    }

    // POST: /api/paystack/initialize
    [HttpPost("initialize")]
    public async Task<IActionResult> InitializePayment(
        [FromBody] InitializePaymentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                message = "Customer email is required."
            });
        }

        if (request.Amount <= 0)
        {
            return BadRequest(new
            {
                message = "Payment amount must be greater than zero."
            });
        }

        if (request.OrderId == null)
        {
            return BadRequest(new
            {
                message = "Order ID is required."
            });
        }

        // Find the LUXECART order
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == request.OrderId.Value);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        // Prevent paying for an already paid order
        if (order.PaymentStatus == "Paid")
        {
            return BadRequest(new
            {
                message = "This order has already been paid."
            });
        }

        // Make sure frontend amount matches database amount
        if (Math.Abs(order.TotalAmount - request.Amount) > 0.01m)
        {
            return BadRequest(new
            {
                message = "Payment amount does not match the order total."
            });
        }

        var secretKey =
            _configuration["Paystack:SecretKey"];

        if (string.IsNullOrWhiteSpace(secretKey))
        {
            return StatusCode(500, new
            {
                message = "Paystack secret key is not configured."
            });
        }

        var client =
            _httpClientFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                secretKey
            );

        var reference =
            $"LUXE-{Guid.NewGuid():N}";

        // Paystack expects amounts in the smallest
        // currency unit.
        var amountInSubunit =
            Convert.ToInt64(
                Math.Round(order.TotalAmount * 100)
            );

        var payload = new
        {
            email = order.CustomerEmail,
            amount = amountInSubunit,
            currency = "GHS",
            reference = reference,

            callback_url =
                "http://localhost:5173/payment-callback",

            metadata = new
            {
                orderId = order.Id,
                customerName = order.CustomerName
            }
        };

        var json =
            JsonSerializer.Serialize(payload);

        using var content =
            new StringContent(
                json,
                Encoding.UTF8,
                "application/json"
            );

        var response =
            await client.PostAsync(
                "https://api.paystack.co/transaction/initialize",
                content
            );

        var responseBody =
            await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode(
                (int)response.StatusCode,
                new
                {
                    message = "Paystack initialization failed.",
                    details = responseBody
                }
            );
        }

        using var document =
            JsonDocument.Parse(responseBody);

        var root =
            document.RootElement;

        if (!root.TryGetProperty(
                "data",
                out var data))
        {
            return StatusCode(500, new
            {
                message = "Invalid response received from Paystack."
            });
        }

        return Ok(new
        {
            authorizationUrl =
                data.GetProperty(
                    "authorization_url"
                ).GetString(),

            accessCode =
                data.GetProperty(
                    "access_code"
                ).GetString(),

            reference =
                data.GetProperty(
                    "reference"
                ).GetString(),

            orderId = order.Id
        });
    }

    // GET: /api/paystack/verify/{reference}
    [HttpGet("verify/{reference}")]
    public async Task<IActionResult> VerifyPayment(
        string reference)
    {
        if (string.IsNullOrWhiteSpace(reference))
        {
            return BadRequest(new
            {
                message = "Transaction reference is required."
            });
        }

        var secretKey =
            _configuration["Paystack:SecretKey"];

        if (string.IsNullOrWhiteSpace(secretKey))
        {
            return StatusCode(500, new
            {
                message = "Paystack secret key is not configured."
            });
        }

        var client =
            _httpClientFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                secretKey
            );

        var response =
            await client.GetAsync(
                $"https://api.paystack.co/transaction/verify/{Uri.EscapeDataString(reference)}"
            );

        var responseBody =
            await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode(
                (int)response.StatusCode,
                new
                {
                    message = "Paystack verification failed.",
                    details = responseBody
                }
            );
        }

        using var document =
            JsonDocument.Parse(responseBody);

        var root =
            document.RootElement;

        if (!root.TryGetProperty(
                "data",
                out var data))
        {
            return StatusCode(500, new
            {
                message = "Invalid verification response from Paystack."
            });
        }

        var status =
            data.GetProperty("status").GetString();

        var amount =
            data.GetProperty("amount").GetInt64();

        var currency =
            data.GetProperty("currency").GetString();

        int? orderId = null;

        if (
            data.TryGetProperty(
                "metadata",
                out var metadata
            ) &&
            metadata.TryGetProperty(
                "orderId",
                out var orderIdValue
            )
        )
        {
            if (
                orderIdValue.ValueKind ==
                JsonValueKind.Number
            )
            {
                orderId =
                    orderIdValue.GetInt32();
            }
        }

        if (orderId == null)
        {
            return BadRequest(new
            {
                message =
                    "Order ID was not found in the Paystack transaction."
            });
        }

        var order =
            await _context.Orders
                .FirstOrDefaultAsync(
                    o => o.Id == orderId.Value
                );

        if (order == null)
        {
            return NotFound(new
            {
                message = "LUXECART order not found."
            });
        }

        var expectedAmount =
            Convert.ToInt64(
                Math.Round(order.TotalAmount * 100)
            );

        var paymentSuccessful =
            status == "success" &&
            currency == "GHS" &&
            amount == expectedAmount;

        if (paymentSuccessful)
        {
            order.PaymentStatus = "Paid";
            order.PaidAt = DateTime.UtcNow;

            if (order.DeliveryStatus == "Pending")
            {
                order.DeliveryStatus = "Processing";
            }

            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            success = paymentSuccessful,
            reference,
            status,
            amount,
            currency,
            orderId = order.Id,
            paymentStatus = order.PaymentStatus,
            deliveryStatus = order.DeliveryStatus
        });
    }
}

public class InitializePaymentRequest
{
    public string Email { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public int? OrderId { get; set; }
}