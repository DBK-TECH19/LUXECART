using Ecommerce.API.Data;
using Microsoft.EntityFrameworkCore;
using Ecommerce.API.Services;

var builder = WebApplication.CreateBuilder(args);

// ================================
// DATABASE
// ================================

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// ================================
// API SERVICES
// ================================

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddHttpClient();

// ================================
// CORS
// ================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
// ================================
// APPLICATION SERVICES
// ================================

builder.Services.AddScoped<EmailService>();

var app = builder.Build();

// ================================
// OPENAPI
// ================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// ================================
// CORS
// ================================

app.UseCors("Frontend");

// ================================
// CONTROLLERS
// ================================

app.MapControllers();

app.Run();