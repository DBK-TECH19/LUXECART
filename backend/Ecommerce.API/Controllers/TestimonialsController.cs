using Ecommerce.API.Data;
using Ecommerce.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/testimonials")]
public class TestimonialsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TestimonialsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: /api/testimonials
    // Admin gets all testimonials
    [HttpGet]
    public async Task<IActionResult> GetTestimonials()
    {
        var testimonials = await _context.Testimonials
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new
            {
                t.Id,
                t.UserId,
                t.CustomerName,
                t.CustomerRole,
                t.Comment,
                t.Rating,
                t.IsApproved,
                t.CreatedAt
            })
            .ToListAsync();

        return Ok(testimonials);
    }

    // GET: /api/testimonials/approved
    // Public homepage gets approved testimonials only
    [HttpGet("approved")]
    public async Task<IActionResult> GetApprovedTestimonials()
    {
        var testimonials = await _context.Testimonials
            .Where(t => t.IsApproved)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new
            {
                t.Id,
                t.CustomerName,
                t.CustomerRole,
                t.Comment,
                t.Rating,
                t.CreatedAt
            })
            .ToListAsync();

        return Ok(testimonials);
    }

    // GET: /api/testimonials/customer/1
    [HttpGet("customer/{userId}")]
    public async Task<IActionResult> GetCustomerTestimonials(
        int userId)
    {
        var testimonials = await _context.Testimonials
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new
            {
                t.Id,
                t.UserId,
                t.CustomerName,
                t.CustomerRole,
                t.Comment,
                t.Rating,
                t.IsApproved,
                t.CreatedAt
            })
            .ToListAsync();

        return Ok(testimonials);
    }

    // POST: /api/testimonials
    [HttpPost]
    public async Task<IActionResult> CreateTestimonial(
        [FromBody] Testimonial testimonial)
    {
        if (string.IsNullOrWhiteSpace(
            testimonial.CustomerName))
        {
            return BadRequest(new
            {
                message = "Customer name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(
            testimonial.Comment))
        {
            return BadRequest(new
            {
                message = "Testimonial comment is required."
            });
        }

        if (
            testimonial.Rating < 1 ||
            testimonial.Rating > 5)
        {
            return BadRequest(new
            {
                message = "Rating must be between 1 and 5."
            });
        }

        var newTestimonial = new Testimonial
        {
            UserId = testimonial.UserId,
            CustomerName =
                testimonial.CustomerName.Trim(),
            CustomerRole =
                testimonial.CustomerRole?.Trim() ?? "",
            Comment =
                testimonial.Comment.Trim(),
            Rating = testimonial.Rating,
            IsApproved = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Testimonials.Add(
            newTestimonial);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            newTestimonial.Id,
            newTestimonial.UserId,
            newTestimonial.CustomerName,
            newTestimonial.CustomerRole,
            newTestimonial.Comment,
            newTestimonial.Rating,
            newTestimonial.IsApproved,
            newTestimonial.CreatedAt
        });
    }

    // PUT: /api/testimonials/1/approve
    [HttpPut("{id}/approve")]
    public async Task<IActionResult> ApproveTestimonial(
        int id)
    {
        var testimonial =
            await _context.Testimonials.FindAsync(id);

        if (testimonial == null)
        {
            return NotFound(new
            {
                message = "Testimonial not found."
            });
        }

        testimonial.IsApproved = true;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message =
                "Testimonial approved successfully.",
            testimonial = new
            {
                testimonial.Id,
                testimonial.UserId,
                testimonial.CustomerName,
                testimonial.CustomerRole,
                testimonial.Comment,
                testimonial.Rating,
                testimonial.IsApproved,
                testimonial.CreatedAt
            }
        });
    }

    // PUT: /api/testimonials/1/reject
    [HttpPut("{id}/reject")]
    public async Task<IActionResult> RejectTestimonial(
        int id)
    {
        var testimonial =
            await _context.Testimonials.FindAsync(id);

        if (testimonial == null)
        {
            return NotFound(new
            {
                message = "Testimonial not found."
            });
        }

        testimonial.IsApproved = false;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message =
                "Testimonial rejected successfully.",
            testimonial = new
            {
                testimonial.Id,
                testimonial.UserId,
                testimonial.CustomerName,
                testimonial.CustomerRole,
                testimonial.Comment,
                testimonial.Rating,
                testimonial.IsApproved,
                testimonial.CreatedAt
            }
        });
    }

    // DELETE: /api/testimonials/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTestimonial(
        int id)
    {
        var testimonial =
            await _context.Testimonials.FindAsync(id);

        if (testimonial == null)
        {
            return NotFound(new
            {
                message = "Testimonial not found."
            });
        }

        _context.Testimonials.Remove(testimonial);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message =
                "Testimonial deleted successfully."
        });
    }
}