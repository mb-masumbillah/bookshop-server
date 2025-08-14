import nodemailer from 'nodemailer'
import { TEmailSend } from './opt.interface'

const sendEmail = async (userData: TEmailSend) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'masumbillah2062003@gmail.com',
      pass: 'bqgk zkid blwa ztdc', // App password
    },
  })

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
      <h2 style="color: #333; text-align: center;">🔐 OTP Verification</h2>
      <p style="color: #555;">Hello, ${userData?.name}</p>
      <p style="color: #555;">
        Please use the One-Time Password (OTP) below to complete your verification:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; background: #4CAF50; color: white; font-size: 24px; letter-spacing: 5px; padding: 10px 20px; border-radius: 6px;">
          ${userData.otpCode && userData.otpCode} ${userData?.link && userData?.link}
        </span>
      </div>
      <p style="color: #777; text-align: center;">
        This ${userData?.otpCode && 'OTP'} ${userData?.link && 'Reset Link'} will expire in <strong>${userData.expireInSeconds} seconds</strong>.
      </p>
      <hr>
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        If you did not request this, please ignore this email.
      </p>
    </div>
  `

  await transporter.sendMail({
    from: '"BookShop" <masumbillah2062003@gmail.com>',
    to: userData.email,
    subject: 'Your OTP Code',
    text: `Your ${userData?.otpCode && 'OTP'} ${userData?.link && 'Reset Link'} is:  ${userData.otpCode && userData.otpCode} ${userData?.link && userData?.link}. It will expire in ${userData.expireInSeconds} seconds.`,
    html: htmlTemplate,
  })
}

export default sendEmail
