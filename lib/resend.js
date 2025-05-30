import { Resend } from "resend";

import axios from "axios";

const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.RESEND_SENDER_EMAIL;


async function getPdfAsBase64(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer', // Get the PDF as a binary buffer
  });
  return Buffer.from(response.data, 'binary').toString('base64'); // Convert to base64
}

export async function sendContactEmail(data) {
  const {
    firstname,
    lastname,
    email,
    phone,
    message,
    redisId,
    baseUrl,
  } = data;
  console.log("data from email dapi", data)
  
const fullname = firstname + " " + lastname
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
                padding: 12px 20px; 
                width: 85%; 
                max-width: 280px; 
                font-size: 14px; 
                box-sizing: border-box; 
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
              <p>Dear <span class="highlight">${fullname}</span>,</p>
              <p>Thank you for contacting Cat6 Security about your upcoming</span> project. Here's a summary of the information you provided:</p>
              
              <div class="card">
                <table class="table">
                  <tr><th>Name</th><td>${fullname}</td></tr>
                  <tr><th>Email</th><td>${email}</td></tr>
                  <tr><th>Phone</th><td>${phone || "Not provided"}</td></tr>
                  ${
                    message
                      ? `<tr><th>Message</th><td>${message}</td></tr>`
                      : ""
                  }
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
    firstname,
    lastname,
    email,
    phone,
  } = data;

  try {
    const emailResponse = await resend.emails.send({
      to: email,
      subject: "Cat6 Security - Sorry we missed you!",
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
            .cta-button { 
              display: inline-block; 
              padding: 14px 28px; 
              background: #1a1a2e; 
              color: #ffffff !important; 
              text-decoration: none; 
              border-radius: 6px; 
              font-size: 15px; 
              font-weight: 600; 
              margin: 16px 0; 
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
              .cta-button { 
                display: block; 
                margin: 12px auto; 
                width: 90%; 
                text-align: center; 
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
              <p>Hi <span class="highlight">${firstname}</span>,</p>
              
              <p>Sorry we missed you!</p>
              
              <p>If you're still interested in our security solutions, please fill out our contact form again and we'll get back to you promptly.</p>
              
              <a href="https://cat6security.com/#contact" class="cta-button">Fill Out Contact Form</a>
              
              <p>Thank you for your interest in Cat6 Security.</p>
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cat6 Security. All rights reserved.</p>
              <p>
                <a href="https://cat6security.com">Our Website</a> | 
                <a href="mailto:support@cat6security.com">Email Support</a>
              </p>
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

export async function sendDiscountEmail(data) {

  const {
      firstname,
      lastname,
      email, 
      propertyType,
      uuid,
      paymentLink
  } = data;
  console.log("from discountEmail", data);
  try {
    const emailResponse = await resend.emails.send({
      to: email,
      subject: "🚀 Exclusive Offer: Pay $500 Now, Get 1 Year Free Maintenance!",
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
              background: linear-gradient(135deg, #1a1a2e 0%, #3a3a5e 100%); 
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
            .offer-badge {
              background: #ffd700;
              color: #1a1a2e;
              font-weight: 700;
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
              margin-top: 12px;
              font-size: 14px;
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
            .offer-card {
              background: #f8f9ff;
              border: 2px solid #e6e8ff;
              border-radius: 8px;
              padding: 24px;
              margin: 24px 0;
              text-align: center;
            }
            .offer-price {
              font-size: 36px;
              font-weight: 700;
              color: #1a1a2e;
              margin: 10px 0;
            }
            .offer-details {
              font-size: 18px;
              font-weight: 600;
              color: #3a3a5e;
              margin-bottom: 16px;
            }
            .benefits-list {
              text-align: left;
              margin: 20px 0;
              padding-left: 20px;
            }
            .benefits-list li {
              margin-bottom: 10px;
              position: relative;
            }
            .benefits-list li:before {
              content: "✓";
              color: #4CAF50;
              font-weight: bold;
              position: absolute;
              left: -20px;
            }
            .cta-button {
              display: inline-block;
              padding: 16px 32px;
              background: linear-gradient(135deg, #1a1a2e 0%, #3a3a5e 100%);
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 600;
              margin: 16px 0;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              box-shadow: 0 4px 12px rgba(26, 26, 46, 0.15);
            }
            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(26, 26, 46, 0.2);
            }
            .deadline-notice {
              background: #fff8e6;
              border-left: 4px solid #ffd700;
              padding: 12px 16px;
              margin: 20px 0;
              font-size: 14px;
            }
            .footer { 
              padding: 20px; 
              text-align: center; 
              font-size: 12px; 
              color: #888888; 
              background: #f9f9fb;
              border-top: 1px solid #eaeaea;
            }
            @media (max-width: 600px) {
              .container { 
                margin: 10px; 
                border-radius: 8px; 
              }
              .header { 
                padding: 24px 15px; 
              }
              .offer-price {
                font-size: 28px;
              }
              .cta-button {
                padding: 14px 24px;
                font-size: 15px;
                display: block;
                margin: 16px auto;
                width: 90%;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Exclusive Maintenance Offer</h1>
              <div class="offer-badge">LIMITED TIME</div>
            </div>
            
            <div class="content">
              <p>Dear <strong>${firstname} ${lastname}</strong>,</p>
              
              <p>As a valued customer considering our <strong>${propertyType}</strong> security system, we're pleased to offer you this exclusive maintenance package:</p>
              
              <div class="offer-card">
                <div class="offer-price">$500</div>
                <div class="offer-details">Pay now & get our Maintenance and Emergency Support Package FREE for 1 YEAR!</div>
                <p>That's 12 months of worry-free system monitoring and support at no additional cost!</p>
                
                <ul class="benefits-list">
                  <li>Priority technical support</li>
                  <li>Regular system health checks</li>
                  <li>Software/firmware updates</li>
                  <li>Remote troubleshooting</li>
                  <li>Discounts on any additional services</li>
                </ul>
                
                <a href="${paymentLink}" class="cta-button">Claim This Offer Now</a>
                
                <div class="deadline-notice">
                  <strong>Offer expires in 7 days</strong> - this discount cannot be applied retroactively
                </div>
              </div>
              
              <p>This maintenance plan normally costs $<strong>1200</strong>/year - you're saving <strong>$700</strong> with this exclusive offer!</p>
              
              <p>To take advantage of this offer or if you have any questions, simply reply to this email or call us at <strong>(437) 292-0555</strong>.</p>
              
              <p>Best regards,<br>
              The Cat6 Security Team</p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cat6 Security. All rights reserved.</p>
              <p> <a href="tel:4372920555">(437) 292-0555</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      from: `Cat6 Security <${senderEmail}>`,
      reply_to: "offers@cat6security.com",
    });
    return emailResponse;
  } catch (error) {
    console.error("Error sending discount email:", error);
    throw new Error("Failed to send discount email");
  }
}

export const sendInvoiceEmail = async ({
  invoiceId,
  quoteUrl,
  contactEmail,
  products,
  total,
  itemCount,
}) => {
  try {
    const response = await resend.emails.send({
      from: "quotes@cat6security.com",
      to: contactEmail,
      subject: "Your Cat6 Security Quote",
      html: `
        <h1>Your Quote from Cat6 Security</h1>
        <p>Items: ${itemCount}</p>
        <p>Total: CAD $${total.toFixed(2)}</p>
        <p><a href="${quoteUrl}">View your quote</a></p>
      `,
    });
    return { success: true, response };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

export async function sendQuoteToClient({ pdfUrl, contact, items, total }) {
  try {
    const pdfBase64 = await getPdfAsBase64(pdfUrl);

    const response = await resend.emails.send({
      from: `Cat6 Security <${senderEmail}>`,
      to: contact.email,
      subject: "Your Cat6 Security Quote",
      html: `
        <h1>Your Quote from Cat6 Security</h1>
        <p>Items: ${items.length}</p>
        <p>Total: CAD $${total}</p>
        <p>Please see the attached quote PDF.</p>
      `,
      attachments: [
        {
          filename: "Cat6_Security_Quote.pdf",
          content: pdfBase64,
          type: "application/pdf",
          encoding: "base64",
        },
      ],
    });

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send quote email");
  }
}