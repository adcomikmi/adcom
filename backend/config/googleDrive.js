// backend/config/googleDrive.js
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Fix untuk newline di .env
  },
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

export default drive;