namespace Ecommerce.API.Models;

public class CustomerMessage
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public User? User { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerEmail { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string Reply { get; set; } = string.Empty;

    public string Status { get; set; } = "New";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? RepliedAt { get; set; }
}