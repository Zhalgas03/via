import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function send2FACode(email: string, code: string) {
  await transporter.sendMail({
    from: `"ViaMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your verification code",
    html: `
      <h2>ViaMart login verification</h2>
      <p>Your code:</p>
      <h1>${code}</h1>
      <p>Code is valid for 10 minutes.</p>
    `,
  })
}
