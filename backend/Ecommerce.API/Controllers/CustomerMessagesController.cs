using Ecommerce.API.Data;
using Ecommerce.API.Models;
using Ecommerce.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/customer-messages")]
public class CustomerMessagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly EmailService _emailService;

    public CustomerMessagesController(
        ApplicationDbContext context,
        EmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages()
    {
        var messages = await _context.CustomerMessages
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new
            {
                m.Id,
                m.UserId,
                m.CustomerName,
                m.CustomerEmail,
                m.Message,
                m.Reply,
                m.Status,
                m.CreatedAt,
                m.RepliedAt
            })
            .ToListAsync();

        return Ok(messages);
    }

    [HttpGet("customer/{userId}")]
    public async Task<IActionResult> GetCustomerMessages(int userId)
    {
        var messages = await _context.CustomerMessages
            .Where(m => m.UserId == userId)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new
            {
                m.Id,
                m.UserId,
                m.CustomerName,
                m.CustomerEmail,
                m.Message,
                m.Reply,
                m.Status,
                m.CreatedAt,
                m.RepliedAt
            })
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMessage(
        [FromBody] CustomerMessage message)
    {
        if (string.IsNullOrWhiteSpace(message.CustomerName))
            return BadRequest(new { message = "Name is required." });

        if (string.IsNullOrWhiteSpace(message.CustomerEmail))
            return BadRequest(new { message = "Email is required." });

        if (string.IsNullOrWhiteSpace(message.Message))
            return BadRequest(new { message = "Message is required." });

        var newMessage = new CustomerMessage
        {
            UserId = message.UserId,
            CustomerName = message.CustomerName.Trim(),
            CustomerEmail = message.CustomerEmail.Trim(),
            Message = message.Message.Trim(),
            Reply = string.Empty,
            Status = "New",
            CreatedAt = DateTime.UtcNow,
            RepliedAt = null
        };

        _context.CustomerMessages.Add(newMessage);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            newMessage.Id,
            newMessage.UserId,
            newMessage.CustomerName,
            newMessage.CustomerEmail,
            newMessage.Message,
            newMessage.Reply,
            newMessage.Status,
            newMessage.CreatedAt,
            newMessage.RepliedAt
        });
    }

    [HttpPut("{id}/reply")]
    public async Task<IActionResult> ReplyToMessage(
        int id,
        [FromBody] ReplyRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Reply))
        {
            return BadRequest(new
            {
                message = "Reply is required."
            });
        }

        var existingMessage =
            await _context.CustomerMessages.FindAsync(id);

        if (existingMessage == null)
        {
            return NotFound(new
            {
                message = "Message not found."
            });
        }

        existingMessage.Reply = request.Reply.Trim();
        existingMessage.RepliedAt = DateTime.UtcNow;

        /*
         * Send the email BEFORE marking the message as Replied.
         * This prevents the database from saying "Replied"
         * when Gmail delivery failed.
         */
        try
        {
            await _emailService.SendReplyAsync(
                existingMessage.CustomerEmail,
                existingMessage.CustomerName,
                existingMessage.Reply
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                $"[EMAIL ERROR] {ex.Message}"
            );

            return StatusCode(500, new
            {
                message =
                    "The reply was not sent because the email could not be delivered."
            });
        }

        existingMessage.Status = "Replied";

        await _context.SaveChangesAsync();

        return Ok(new
        {
            existingMessage.Id,
            existingMessage.UserId,
            existingMessage.CustomerName,
            existingMessage.CustomerEmail,
            existingMessage.Message,
            existingMessage.Reply,
            existingMessage.Status,
            existingMessage.CreatedAt,
            existingMessage.RepliedAt
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        var existingMessage =
            await _context.CustomerMessages.FindAsync(id);

        if (existingMessage == null)
        {
            return NotFound(new
            {
                message = "Message not found."
            });
        }

        _context.CustomerMessages.Remove(existingMessage);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Message deleted successfully."
        });
    }
}

public class ReplyRequest
{
    public string Reply { get; set; } = string.Empty;
}