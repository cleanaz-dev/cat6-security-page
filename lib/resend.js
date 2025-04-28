import { Resend } from "resend";
import redis from "./redis";


const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.RESEND_SENDER_EMAIL;

export async function sendContactEmail(data) {
  const { 
    name, 
    email, 
    phone, 
    message, 
    features, 
    city, 
    customCity, 
    projectType, 
    cameraCount, 
    timeline, 
    redisId,
    baseUrl 
  } = data;


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
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <style>
            body { 
              font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              background-color: #f9f9fb; 
              color: #1a1a2e; 
              line-height: 1.6; 
            }
            .container { 
              max-width: 640px; 
              margin: 20px auto; 
              background: #ffffff; 
              border: 1px solid #eaeaea; 
              border-radius: 8px; 
              overflow: hidden; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
            }
            .header { 
              background: #1a1a2e; 
              padding: 32px 20px; 
              text-align: center; 
              color: #ffffff; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 24px; 
              font-weight: 700; 
              letter-spacing: -0.25px; 
            }
            .header p { 
              margin: 8px 0 0; 
              font-size: 15px; 
              font-weight: 400; 
              opacity: 0.9; 
            }
            .content { 
              padding: 32px 24px; 
              background: #ffffff; 
            }
            .content p { 
              margin: 16px 0; 
              font-size: 15px; 
              color: #333333;
            }
            .card { 
              background: #f9f9fb; 
              border: 1px solid #eaeaea; 
              border-radius: 8px; 
              padding: 20px; 
              margin: 24px 0; 
            }
            .table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 14px;
            }
            .table tr:nth-child(odd) { 
              background: #f7f7f9; 
            }
            .table th, .table td { 
              padding: 12px 16px; 
              text-align: left; 
              border-bottom: 1px solid #eaeaea;
            }
            .table th { 
              color: #1a1a2e; 
              font-weight: 600; 
              white-space: nowrap;
            }
            .table td { 
              color: #444444; 
            }
            .cta-buttons { 
              margin: 32px 0; 
              text-align: center; 
            }
            .cta-button { 
              display: inline-block; 
              padding: 14px 28px; 
              background: #1a1a2e; 
              color: #ffffff !important; 
              text-decoration: none; 
              border-radius: 6px; 
              font-size: 15px; 
              font-weight: 600; 
              margin: 8px; 
              transition: background 0.2s ease; 
            }
            .cta-button:hover { 
              background: #33334d !important; 
            }
            .divider { 
              border-top: 1px solid #eaeaea; 
              margin: 24px 0; 
            }
            .footer { 
              padding: 20px; 
              text-align: center; 
              font-size: 12px; 
              color: #888888; 
              background: #f9f9fb;
            }
            .footer a { 
              color: #1a1a2e; 
              text-decoration: none; 
              margin: 0 8px; 
            }
            .social-icons { 
              margin-top: 16px; 
            }
            .social-icon { 
              display: inline-block; 
              width: 32px; 
              height: 32px; 
              background: #d1d1e6; 
              border-radius: 50%; 
              margin: 0 6px; 
              vertical-align: middle;
            }
            .highlight {
              color: #1a1a2e;
              font-weight: 600;
            }
            @media (max-width: 600px) {
              .container { 
                margin: 10px; 
                border-radius: 8px; 
              }
              .header { 
                padding: 24px 15px; 
              }
              .header h1 { 
                font-size: 22px; 
              }
              .content { 
                padding: 24px 16px; 
              }
              .card { 
                padding: 16px; 
              }
              .cta-button { 
                display: block; 
                margin: 12px auto; 
                width: 90%; 
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cat6 Security</h1>
              <p>Advanced Surveillance Solutions</p>
            </div>
            <div class="content">
              <p>Dear <span class="highlight">${name}</span>,</p>
              <p>Thank you for contacting Cat6 Security about your <span class="highlight">${projectType}</span> project. Here's a summary of the information you provided:</p>
              
              <div class="card">
                <table class="table">
                  <tr><th>Name</th><td>${name}</td></tr>
                  <tr><th>Email</th><td>${email}</td></tr>
                  <tr><th>Phone</th><td>${phone || 'Not provided'}</td></tr>
                  <tr><th>Project Type</th><td>${projectType}</td></tr>
                  <tr><th>Camera Count</th><td>${cameraCount || 'Not specified'}</td></tr>
                  <tr><th>Timeline</th><td>${timeline || 'Not specified'}</td></tr>
                  <tr><th>Features</th><td>${features?.join(", ") || 'None selected'}</td></tr>
                  <tr><th>Location</th><td>${city || customCity || 'Not specified'}</td></tr>
                  ${message ? `<tr><th>Message</th><td>${message}</td></tr>` : ""}
                </table>
              </div>

              <p>Our security experts are reviewing your requirements and will contact you shortly. In the meantime, you can:</p>
              
              <div class="cta-buttons">
                <a href="${baseUrl}/speak-with-rep/${redisId}" class="cta-button">Speak With a Representative</a>
                <a href="${baseUrl}/book-zoom/${redisId}" class="cta-button">Schedule a Consultation</a>
              </div>

              <p>We typically respond within <span class="highlight">1 business day</span>. For immediate assistance, please call us at <span class="highlight">(555) 123-4567</span>.</p>
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cat6 Security. All rights reserved.</p>
              <p>
                <a href="https://cat6security.com">Our Website</a> | 
                <a href="mailto:support@cat6security.com">Email Support</a> | 
                <a href="tel:5551234567">Call Us</a>
              </p>
              <div class="social-icons">
                <a href="https://facebook.com/cat6security" class="social-icon"></a>
                <a href="https://twitter.com/cat6security" class="social-icon"></a>
                <a href="https://linkedin.com/company/cat6security" class="social-icon"></a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      from: `Cat6 Security <${senderEmail}>`,
      reply_to: "support@cat6security.com",
    });
    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendFollowUpEmail(data) {
  const { 
    name, 
    email, 
    phone, 
    message, 
    features, 
    city, 
    customCity, 
    projectType, 
    cameraCount, 
    timeline, 
    zoomToken, 
    repToken, 
    baseUrl 
  } = data;

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
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <style>
            body { 
              font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              background-color: #f9f9fb; 
              color: #1a1a2e; 
              line-height: 1.6; 
            }
            .container { 
              max-width: 640px; 
              margin: 20px auto; 
              background: #ffffff; 
              border: 1px solid #eaeaea; 
              border-radius: 8px; 
              overflow: hidden; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
            }
            .header { 
              background: #1a1a2e; 
              padding: 32px 20px; 
              text-align: center; 
              color: #ffffff; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 24px; 
              font-weight: 700; 
              letter-spacing: -0.25px; 
            }
            .header p { 
              margin: 8px 0 0; 
              font-size: 15px; 
              font-weight: 400; 
              opacity: 0.9; 
            }
            .content { 
              padding: 32px 24px; 
              background: #ffffff; 
            }
            .content p { 
              margin: 16px 0; 
              font-size: 15px; 
              color: #333333;
            }
            .card { 
              background: #f9f9fb; 
              border: 1px solid #eaeaea; 
              border-radius: 8px; 
              padding: 20px; 
              margin: 24px 0; 
            }
            .table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 14px;
            }
            .table tr:nth-child(odd) { 
              background: #f7f7f9; 
            }
            .table th, .table td { 
              padding: 12px 16px; 
              text-align: left; 
              border-bottom: 1px solid #eaeaea;
            }
            .table th { 
              color: #1a1a2e; 
              font-weight: 600; 
              white-space: nowrap;
            }
            .table td { 
              color: #444444; 
            }
            .cta-buttons { 
              margin: 32px 0; 
              text-align: center; 
            }
            .cta-button { 
              display: inline-block; 
              padding: 14px 28px; 
              background: #1a1a2e; 
              color: #ffffff !important; 
              text-decoration: none; 
              border-radius: 6px; 
              font-size: 15px; 
              font-weight: 600; 
              margin: 8px; 
              transition: background 0.2s ease; 
            }
            .cta-button:hover { 
              background: #33334d !important; 
            }
            .divider { 
              border-top: 1px solid #eaeaea; 
              margin: 24px 0; 
            }
            .footer { 
              padding: 20px; 
              text-align: center; 
              font-size: 12px; 
              color: #888888; 
              background: #f9f9fb;
            }
            .footer a { 
              color: #1a1a2e; 
              text-decoration: none; 
              margin: 0 8px; 
            }
            .social-icons { 
              margin-top: 16px; 
            }
            .social-icon { 
              display: inline-block; 
              width: 32px; 
              height: 32px; 
              background: #d1d1e6; 
              border-radius: 50%; 
              margin: 0 6px; 
              vertical-align: middle;
            }
            .highlight {
              color: #1a1a2e;
              font-weight: 600;
            }
            @media (max-width: 600px) {
              .container { 
                margin: 10px; 
                border-radius: 8px; 
              }
              .header { 
                padding: 24px 15px; 
              }
              .header h1 { 
                font-size: 22px; 
              }
              .content { 
                padding: 24px 16px; 
              }
              .card { 
                padding: 16px; 
              }
              .cta-button { 
                display: block; 
                margin: 12px auto; 
                width: 90%; 
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cat6 Security</h1>
              <p>Advanced Surveillance Solutions</p>
            </div>
            <div class="content">
              <p>Dear <span class="highlight">${name}</span>,</p>
              <p>Thank you for contacting Cat6 Security about your <span class="highlight">${projectType}</span> project. Here's a summary of the information you provided:</p>
              
              <div class="card">
                <table class="table">
                  <tr><th>Name</th><td>${name}</td></tr>
                  <tr><th>Email</th><td>${email}</td></tr>
                  <tr><th>Phone</th><td>${phone || 'Not provided'}</td></tr>
                  <tr><th>Project Type</th><td>${projectType}</td></tr>
                  <tr><th>Camera Count</th><td>${cameraCount || 'Not specified'}</td></tr>
                  <tr><th>Timeline</th><td>${timeline || 'Not specified'}</td></tr>
                  <tr><th>Features</th><td>${features?.join(", ") || 'None selected'}</td></tr>
                  <tr><th>Location</th><td>${city || customCity || 'Not specified'}</td></tr>
                  ${message ? `<tr><th>Message</th><td>${message}</td></tr>` : ""}
                </table>
              </div>

              <p>Our security experts are reviewing your requirements and will contact you shortly. In the meantime, you can:</p>
              
              <div class="cta-buttons">
                <a href="${baseUrl}/speak-with-rep/${repToken}" class="cta-button">Speak With a Representative</a>
                <a href="${baseUrl}/book-zoom/${zoomToken}" class="cta-button">Schedule a Consultation</a>
              </div>

              <p>We typically respond within <span class="highlight">1 business day</span>. For immediate assistance, please call us at <span class="highlight">(555) 123-4567</span>.</p>
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cat6 Security. All rights reserved.</p>
              <p>
                <a href="https://cat6security.com">Our Website</a> | 
                <a href="mailto:support@cat6security.com">Email Support</a> | 
                <a href="tel:5551234567">Call Us</a>
              </p>
              <div class="social-icons">
                <a href="https://facebook.com/cat6security" class="social-icon"></a>
                <a href="https://twitter.com/cat6security" class="social-icon"></a>
                <a href="https://linkedin.com/company/cat6security" class="social-icon"></a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      from: `Cat6 Security <${senderEmail}>`,
      reply_to: "support@cat6security.com",
    });
    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}