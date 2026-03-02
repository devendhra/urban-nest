import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { name, email, message, ownerEmail } = await req.json();

        if (!ownerEmail) {
            return NextResponse.json({ message: 'Owner email is required' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER || 'devadvahdmmd@gmail.com',
                pass: process.env.EMAIL_PASS || 'gppfqopawuasjevb',
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || 'devadvahdmmd@gmail.com',
            to: ownerEmail,
            subject: 'Inquiry about your property',
            text: `You have received a message from ${name} (${email}):\n\n${message}`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error in Vercel contactOwner route:', error);
        return NextResponse.json({ message: 'Failed to send email, please try again later' }, { status: 500 });
    }
}
