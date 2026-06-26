import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendDonationReceipt = async (donationData) => {
    const { donorEmail, donorName, amount, campaignTitle, transactionId, date } = donationData;

    const mailOptions = {
        from: `"Donation Platform" <${process.env.EMAIL_USER}>`,
        to: donorEmail,
        subject: 'Thank You for Your Donation - Receipt',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .receipt-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
          .amount { font-size: 32px; font-weight: bold; color: #4F46E5; margin: 10px 0; }
          .footer { background: #374151; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Thank You for Your Donation!</h1>
          </div>
          <div class="content">
            <h2>Dear ${donorName || 'Generous Donor'},</h2>
            <p>We are incredibly grateful for your generous donation. Your support makes a real difference in the lives of those we serve.</p>
            
            <div class="receipt-box">
              <h3>Donation Receipt</h3>
              <div class="amount">₹${amount.toLocaleString('en-IN')}</div>
              <p><strong>Campaign:</strong> ${campaignTitle}</p>
              <p><strong>Transaction ID:</strong> ${transactionId}</p>
              <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</p>
              <p><strong>Status:</strong> <span style="color: #10B981; font-weight: bold;">Successful</span></p>
            </div>

            <p>This email serves as your official donation receipt for tax purposes. Please keep it for your records.</p>
            
            <p>Your contribution will help us continue our mission to make a positive impact in our community.</p>
            
            <a href="${process.env.FRONTEND_URL}" class="button">Visit Our Website</a>
          </div>
          <div class="footer">
            <p>If you have any questions, please contact us at ${process.env.EMAIL_USER}</p>
            <p>&copy; ${new Date().getFullYear()} Donation Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Donation receipt sent successfully');
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        throw error;
    }
};

export const sendContactEmail = async (contactData) => {
    const { name, email, subject, message } = contactData;

    const mailOptions = {
        from: `"Donation Platform" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Contact email sent successfully');
    } catch (error) {
        console.error('❌ Contact email failed:', error.message);
        throw error;
    }
};

export default transporter;
