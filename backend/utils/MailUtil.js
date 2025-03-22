const nodemailer = require("nodemailer");

// Email Sending Function
const sendingMail = async (to, subject, text, html = null) => {
    try {
        // Create Transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Use host instead of service
            port: 587, // Use 465 for SSL, 587 for TLS
            secure: false, // True for port 465, false for port 587
            auth: {
                user: "rushabhparekh124@gmail.com", // Replace with your email
                pass: "qfpn gwfr inzq ieea", // Use an App Password
            },
            tls: {
                rejectUnauthorized: false, // Prevent certificate issues
            }
        });

        // Mail Options
        const mailOptions = {
            from: '"Project Tracker" <rushabhparekh124@gmail.com>', // Sender Name + Email
            to, // Receiver Email
            subject, // Email Subject
            text, // Plain Text Body
            html: html || `<p>${text}</p>`, // HTML Body (Optional)
        };

        // Send Email
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", mailResponse.response);
        return mailResponse;

    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        throw new Error("Failed to send email");
    }
};

module.exports = { sendingMail };
