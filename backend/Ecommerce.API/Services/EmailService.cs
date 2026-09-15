using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Ecommerce.API.Services;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendReplyAsync(
        string customerEmail,
        string customerName,
        string reply)
    {
        var smtpServer =
            _configuration["EmailSettings:SmtpServer"]
            ?? throw new InvalidOperationException(
                "Email SMTP server is not configured."
            );

        var portText =
            _configuration["EmailSettings:Port"]
            ?? "587";

        var port = int.Parse(portText);

        var senderName =
            _configuration["EmailSettings:SenderName"]
            ?? "LUXECART";

        var senderEmail =
            _configuration["EmailSettings:SenderEmail"]
            ?? throw new InvalidOperationException(
                "Email sender address is not configured."
            );

        var username =
            _configuration["EmailSettings:Username"]
            ?? throw new InvalidOperationException(
                "Email username is not configured."
            );

        var password =
            _configuration["EmailSettings:Password"]
            ?? throw new InvalidOperationException(
                "Email password is not configured."
            );

        var email = new MimeMessage();

        email.From.Add(
            new MailboxAddress(
                senderName,
                senderEmail
            )
        );

        email.To.Add(
            new MailboxAddress(
                customerName,
                customerEmail
            )
        );

        email.Subject = "Reply from LUXECART";

        email.Body = new TextPart("plain")
        {
            Text = $"""
            Hello {customerName},

            Thank you for contacting LUXECART.

            {reply}

            Best regards,
            LUXECART
            """
        };

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(
            smtpServer,
            port,
            SecureSocketOptions.StartTls
        );

        await smtp.AuthenticateAsync(
            username,
            password
        );

        await smtp.SendAsync(email);

        await smtp.DisconnectAsync(true);
    }
}