
using Ecommerce.API.Data;
using Ecommerce.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrdersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/orders
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _context.Orders
            .AsNoTracking()
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                o.Id,
                o.UserId,
                o.CustomerName,
                o.CustomerEmail,
                o.CustomerPhone,
                o.ShippingAddress,
                o.TotalAmount,
                o.PaymentStatus,
                o.DeliveryStatus,
                o.CreatedAt,
                o.PaidAt,
                o.ShippedAt,
                o.DeliveredAt
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/orders/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Id == id)
            .Select(o => new
            {
                o.Id,
                o.UserId,
                o.CustomerName,
                o.CustomerEmail,
                o.CustomerPhone,
                o.ShippingAddress,
                o.TotalAmount,
                o.PaymentStatus,
                o.DeliveryStatus,
                o.CreatedAt,
                o.PaidAt,
                o.ShippedAt,
                o.DeliveredAt
            })
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found"
            });
        }

        return Ok(order);
    }

    // GET: api/orders/customer/5
    [HttpGet("customer/{userId}")]
    public async Task<IActionResult> GetCustomerOrders(int userId)
    {
        var userExists = await _context.Users
            .AnyAsync(u => u.Id == userId);

        if (!userExists)
        {
            return NotFound(new
            {
                message = "Customer not found"
            });
        }

        var orders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                o.Id,
                o.UserId,
                o.CustomerName,
                o.CustomerEmail,
                o.CustomerPhone,
                o.ShippingAddress,
                o.TotalAmount,
                o.PaymentStatus,
                o.DeliveryStatus,
                o.CreatedAt,
                o.PaidAt,
                o.ShippedAt,
                o.DeliveredAt
            })
            .ToListAsync();

        return Ok(orders);
    }

    // POST: api/orders
    [HttpPost]
    public async Task<IActionResult> CreateOrder(Order order)
    {
        if (order.UserId.HasValue)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Id == order.UserId.Value
                );

            if (user == null)
            {
                return BadRequest(new
                {
                    message = "Customer account not found."
                });
            }

            order.CustomerName = user.Name;
            order.CustomerEmail = user.Email;

            if (string.IsNullOrWhiteSpace(order.CustomerPhone))
            {
                order.CustomerPhone = user.Phone;
            }

            if (string.IsNullOrWhiteSpace(order.ShippingAddress))
            {
                order.ShippingAddress = user.Address;
            }
        }

        order.Id = 0;
        order.CreatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(order.PaymentStatus))
        {
            order.PaymentStatus = "Pending";
        }

        if (string.IsNullOrWhiteSpace(order.DeliveryStatus))
        {
            order.DeliveryStatus = "Pending";
        }

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetOrder),
            new { id = order.Id },
            new
            {
                order.Id,
                order.UserId,
                order.CustomerName,
                order.CustomerEmail,
                order.CustomerPhone,
                order.ShippingAddress,
                order.TotalAmount,
                order.PaymentStatus,
                order.DeliveryStatus,
                order.CreatedAt,
                order.PaidAt,
                order.ShippedAt,
                order.DeliveredAt
            }
        );
    }

    // PUT: api/orders/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrder(
        int id,
        Order order)
    {
        if (id != order.Id)
        {
            return BadRequest(new
            {
                message = "Order ID does not match"
            });
        }

        var existingOrder = await _context.Orders
            .FindAsync(id);

        if (existingOrder == null)
        {
            return NotFound(new
            {
                message = "Order not found"
            });
        }

        existingOrder.CustomerName = order.CustomerName;
        existingOrder.CustomerEmail = order.CustomerEmail;
        existingOrder.CustomerPhone = order.CustomerPhone;
        existingOrder.ShippingAddress = order.ShippingAddress;
        existingOrder.TotalAmount = order.TotalAmount;
        existingOrder.PaymentStatus = order.PaymentStatus;
        existingOrder.DeliveryStatus = order.DeliveryStatus;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            existingOrder.Id,
            existingOrder.UserId,
            existingOrder.CustomerName,
            existingOrder.CustomerEmail,
            existingOrder.CustomerPhone,
            existingOrder.ShippingAddress,
            existingOrder.TotalAmount,
            existingOrder.PaymentStatus,
            existingOrder.DeliveryStatus,
            existingOrder.CreatedAt,
            existingOrder.PaidAt,
            existingOrder.ShippedAt,
            existingOrder.DeliveredAt
        });
    }

    // PUT: api/orders/5/delivery
    [HttpPut("{id}/delivery")]
    public async Task<IActionResult> UpdateDeliveryStatus(
        int id,
        [FromBody] DeliveryStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found"
            });
        }

        var status = request.Status?.Trim();

        if (string.IsNullOrWhiteSpace(status))
        {
            return BadRequest(new
            {
                message = "Delivery status is required."
            });
        }

        var validStatuses = new[]
        {
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        };

        var validStatus = validStatuses.FirstOrDefault(
            s => s.Equals(
                status,
                StringComparison.OrdinalIgnoreCase)
        );

        if (validStatus == null)
        {
            return BadRequest(new
            {
                message = "Invalid delivery status."
            });
        }

        order.DeliveryStatus = validStatus;

        if (validStatus == "Shipped" && order.ShippedAt == null)
        {
            order.ShippedAt = DateTime.UtcNow;
        }

        if (validStatus == "Delivered" && order.DeliveredAt == null)
        {
            order.DeliveredAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            order.Id,
            order.UserId,
            order.PaymentStatus,
            order.DeliveryStatus,
            order.CreatedAt,
            order.PaidAt,
            order.ShippedAt,
            order.DeliveredAt
        });
    }

    // PUT: api/orders/5/payment
    [HttpPut("{id}/payment")]
    public async Task<IActionResult> UpdatePaymentStatus(
        int id,
        [FromBody] PaymentStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found"
            });
        }

        var status = request.Status?.Trim();

        if (string.IsNullOrWhiteSpace(status))
        {
            return BadRequest(new
            {
                message = "Payment status is required."
            });
        }

        var validStatuses = new[]
        {
            "Pending",
            "Paid",
            "Failed"
        };

        var validStatus = validStatuses.FirstOrDefault(
            s => s.Equals(
                status,
                StringComparison.OrdinalIgnoreCase)
        );

        if (validStatus == null)
        {
            return BadRequest(new
            {
                message = "Invalid payment status."
            });
        }

        order.PaymentStatus = validStatus;

        if (validStatus == "Paid")
        {
            order.PaidAt ??= DateTime.UtcNow;

            if (order.DeliveryStatus == "Pending")
            {
                order.DeliveryStatus = "Processing";
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            order.Id,
            order.UserId,
            order.PaymentStatus,
            order.DeliveryStatus,
            order.CreatedAt,
            order.PaidAt,
            order.ShippedAt,
            order.DeliveredAt
        });
    }

    // DELETE: api/orders/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found"
            });
        }

        _context.Orders.Remove(order);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Order deleted successfully"
        });
    }
}

// Request models
public class DeliveryStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class PaymentStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
