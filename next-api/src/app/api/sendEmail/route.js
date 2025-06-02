import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

dotenv.config();

const OAUTH_EMAIL = process.env.OAUTH_EMAIL || ''
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || '';
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || '';
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN || '';

export async function POST(request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        console.log(contentType)
        if (!contentType.includes('application/json')) {
            throw new Error('Invalid content-type. Expected application/json');
        }
        const body = await request.json();
        const { to, subject, text } = body;
        
        // create OAuth2 client
        const oauth2Client = new OAuth2(
            OAUTH_CLIENT_ID,
            OAUTH_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );
        
        // set refresh token
        oauth2Client.setCredentials({
            refresh_token: OAUTH_REFRESH_TOKEN
        });
        
        // get access token using promise
        const {token} = await oauth2Client.getAccessToken()
        
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            // host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
                type: 'OAuth2',
                user: OAUTH_EMAIL,
                clientId: OAUTH_CLIENT_ID,
                clientSecret: OAUTH_CLIENT_SECRET,
                accessToken: token
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailOption = {
            from: OAUTH_EMAIL,
            to,
            subject,
            text,
        }

        // send mail
        const info = await transporter.sendMail(mailOption);
        console.log('Message sent: %s', info.messageId);

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            info
        });


    } catch (error) {
        console.error('❌ Email send error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        }, { status: 500 });
    }
}