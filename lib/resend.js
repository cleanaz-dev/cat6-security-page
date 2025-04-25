import { Resend } from "resend";
import { randomUUID } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.RESEND_SENDER_EMAIL;

export async function sendContactEmail(data) {
  const { name, email, phone, message, features, city, customCity, projectType, cameraCount, timeline } = data;

  // Generate unique tokens for links (in production, store in DB with user data)
  const repToken = randomUUID();
  const zoomToken = randomUUID();
  const baseUrl = "https://cat6security.com";

  try {
    const emailResponse = await resend.emails.send({
      to: email,
      subject: "Cat6 Security - Secure Your Future Today!",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9fb; color: #1a1a2e; line-height: 1.6; }
            .container { max-width: 640px; margin: 20px auto; background: #ffffff; border: 1px solid #d1d1e6; border-radius: 16px; overflow: hidden; }
            .header { position: relative; background: linear-gradient(135deg, #7319e7 0%, #4ffbdf 100%); padding: 40px 20px; text-align: center; color: #f9f9fb; }
            .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 100%; background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%); }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 8px 0 0; font-size: 16px; font-weight: 300; opacity: 0.9; }
            .content { padding: 30px 20px; background: #ffffff; }
            .content p { margin: 12px 0; font-size: 16px; font-weight: 400; }
            .card { background: #f9f9fb; border: 1px solid #d1d1e6; border-radius: 12px; padding: 20px; margin: 20px 0; }
            .table { width: 100%; border-collapse: collapse; }
            .table tr:nth-child(odd) { background: #f0f0f7; }
            .table th, .table td { padding: 12px; text-align: left; font-size: 14px; }
            .table th { color: #1a1a2e; font-weight: 600; }
            .table td { color: #73738c; }
            .cta-buttons { margin: 30px 0; text-align: center; }
            .cta-button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #7319e7 0%, #5a14b9 100%); color: #f9f9fb; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; margin: 10px; transition: transform 0.2s ease; }
            .cta-button:hover { transform: scale(1.05); background: #5a14b9; }
            .divider { border-top: 1px solid #d1d1e6; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #73738c; }
            .footer a { color: #7319e7; text-decoration: none; margin: 0 8px; }
            .social-icons { margin-top: 10px; }
            .social-icon { display: inline-block; width: 24px; height: 24px; background: #d1d1e6; border-radius: 50%; margin: 0 5px; }
            @media (max-width: 600px) {
              .container { margin: 10px; border-radius: 12px; }
              .header { padding: 30px 15px; }
              .header h1 { font-size: 24px; }
              .content { padding: 20px 15px; }
              .card { padding: 15px; }
              .table th, .table td { font-size: 13px; }
              .cta-button { display: block; margin: 12px auto; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cat6 Security</h1>
              <p>Your Trusted Partner in Advanced Surveillance</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Welcome to Cat6 Security! Your request for a custom security solution has us thrilled. Here’s what you shared with us:</p>
              <div class="card">
                <table class="table">
                  <tr><th>Name</th><td>${name}</td></tr>
                  <tr><th>Email</th><td>${email}</td></tr>
                  <tr><th>Phone</th><td>${phone}</td></tr>
                  <tr><th>Project Type</th><td>${projectType}</td></tr>
                  <tr><th>Camera Count</th><td>${cameraCount}</td></tr>
                  <tr><th>Timeline</th><td>${timeline}</td></tr>
                  <tr><th>Features</th><td>${features.join(", ")}</td></tr>
                  <tr><th>City</th><td>${city || customCity}</td></tr>
                  ${message ? `<tr><th>Message</th><td>${message}</td></tr>` : ""}
                </table>
              </div>
              <p>Ready to secure your property? Take the next step now:</p>
              <div class="cta-buttons">
                <a href="${baseUrl}/${repToken}/rep" class="cta-button">Speak to Customer Rep</a>
                <a href="${baseUrl}/${zoomToken}/book-zoom" class="cta-button">Book Zoom Consultation</a>
              </div>
              <p>Act fast to lock in your consultation slot! Our team is ready to craft the perfect security solution for you.</p>
            </div>
            <div class="divider"></div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cat6 Security. All rights reserved.</p>
              <p>
                <a href="https://cat6security.com">cat6security.com</a> | 
                <a href="mailto:support@cat6security.com">support@cat6security.com</a>
              </p>
              <div class="social-icons">
                <a href="#" class="social-icon" style="background: #7319e7;"></a>
                <a href="#" class="social-icon" style="background: #7319e7;"></a>
                <a href="#" class="social-icon" style="background: #7319e7;"></a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      from: `Cat6 Security <${senderEmail}>`,
    });
    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}