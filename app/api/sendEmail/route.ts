import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  recaptchaToken: string;
}

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const { name, email, phone, message, consent, recaptchaToken }: ContactFormData = await req.json();

    // Check for missing fields
    if (!name || !email || !phone || !message || !recaptchaToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get environment variables
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!recaptchaSecretKey || !emailUser || !emailPass) {
      console.error("❌ Missing environment variables");
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Verify reCAPTCHA token
    const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${recaptchaSecretKey}&response=${recaptchaToken}`,
    });

    const recaptchaResult: RecaptchaResponse = await recaptchaRes.json();

    // Validate reCAPTCHA response
    if (!recaptchaResult.success || (recaptchaResult.score && recaptchaResult.score < 0.5)) {
      console.error("❌ reCAPTCHA failed:", recaptchaResult["error-codes"]);
      return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 403 });
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${emailUser}>`,
      to: "shankarpradhan845@gmail.com", // Replace with your recipient email
      replyTo: email,
      subject: `📩 New Contact Form Submission from ${name}`,
      text: `You received a new message:

📌 Name: ${name}
📧 Email: ${email}
📞 Phone: ${phone}
📝 Message: ${message}
✅ Consent: ${consent ? "Yes" : "No"}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Consent:</strong> ${consent ? "Yes" : "No"}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "✅ Email sent successfully!" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error("🔥 Email error:", error.message);
      } else {
        console.error("🔥 Unknown email error:", error);
      }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
