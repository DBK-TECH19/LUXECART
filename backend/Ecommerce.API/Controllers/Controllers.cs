using Ecommerce.API.Data;
using Ecommerce.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        var products = await _context.Products
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/products/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound(new
            {
                message = "Product not found"
            });
        }

        return Ok(product);
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        product.CreatedAt = DateTime.UtcNow;

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetProduct),
            new { id = product.Id },
            product
        );
    }

    // PUT: api/products/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(
        int id,
        Product product)
    {
        if (id != product.Id)
        {
            return BadRequest(new
            {
                message = "Product ID does not match"
            });
        }

        var existingProduct = await _context.Products.FindAsync(id);

        if (existingProduct == null)
        {
            return NotFound(new
            {
                message = "Product not found"
            });
        }

        existingProduct.Name = product.Name;
        existingProduct.Description = product.Description;
        existingProduct.Price = product.Price;
        existingProduct.ImageUrl = product.ImageUrl;
        existingProduct.Category = product.Category;
        existingProduct.StockQuantity = product.StockQuantity;
        existingProduct.IsFeatured = product.IsFeatured;

        await _context.SaveChangesAsync();

        return Ok(existingProduct);
    }

    // DELETE: api/products/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound(new
            {
                message = "Product not found"
            });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Product deleted successfully"
        });
    }
}