const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        // Create transporter with proper Gmail settings
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // smtp.gmail.com
            port: 587,                   // TLS port
            secure: false,               // false for 587
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS, // Gmail App Password
            },
            tls: {
                rejectUnauthorized: false  // bypass SSL issues (safe for dev)
            }
        });

        // Send email
        let info = await transporter.sendMail({
            from: `"StudyNotion || CodeHelp" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email sent successfully:", info.accepted);
        return info;

    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error; // important to propagate error
    }
};

module.exports = mailSender;
