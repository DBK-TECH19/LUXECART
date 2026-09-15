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
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        var orders = await _context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/orders/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found"
            });
        }

        return Ok(order);
    }

    // POST: api/orders
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {
        order.CreatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(order.Status))
        {
            order.Status = "Pending";
        }

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetOrder),
            new { id = order.Id },
            order
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

        var existingOrder = await _context.Orders.FindAsync(id);

        if (existingOrder == null)
        {
            return NotFound(new
            {
                message = "Order not found"
            });
        }

        existingOrder.CustomerName =
            order.CustomerName;

        existingOrder.CustomerEmail =
            order.CustomerEmail;

        existingOrder.CustomerPhone =
            order.CustomerPhone;

        existingOrder.ShippingAddress =
            order.ShippingAddress;

        existingOrder.TotalAmount =
            order.TotalAmount;

        existingOrder.Status =
            order.Status;

        await _context.SaveChangesAsync();

        return Ok(existingOrder);
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