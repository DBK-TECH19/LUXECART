namespace Ecommerce.API.Models;

public class Testimonial
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public User? User { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerRole { get; set; } = string.Empty;

    public string Comment { get; set; } = string.Empty;

    public int Rating { get; set; } = 5;

    public bool IsApproved { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}