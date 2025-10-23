import nodemailer from 'nodemailer';
import {WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    },
});

export const sendWelcomeEmail =async({email,name,intro}:WelcomeEmailData)=>{
        const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}',name)
        .replace('{{intro}}',intro);

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL!,
            to: email,
            subject: 'Welcome to Ikodio - Your Journey to Smart Investing Starts Here!',
            text: `Hi ${name},\n\n${intro}\n\nWe're thrilled to have you on board! Explore our platform to start your investment journey.\n\nBest regards,\nThe Ikodio Team`,
            html: htmlTemplate,
        };

        await transporter.sendMail(mailOptions);

}


export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"Ikodio News" <ikodio@gmail.com>`,
        to: email,
        subject: ` Market News Summary Today - ${date}`,
        text: `Today's market news summary from Ikodio`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};