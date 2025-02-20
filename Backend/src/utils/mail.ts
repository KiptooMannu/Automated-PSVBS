import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, subject: string, message: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: `${subject}`,
            text: message,
            html: `<p>${message}</p>`,
        };
        const mailRes = await transporter.sendMail(mailOptions);
        
        let mailResponse = "";
        if (mailRes.accepted.length > 0) {
            mailResponse = "Email sent successfully";
        } else if (mailRes.rejected.length > 0) {
            mailResponse = "Email not sent, please try again";
        } else {
            mailResponse = "Email server error";
        }
        return mailResponse;
    } catch (error) {
        console.log(error);
        return "Email server error";
    }
}