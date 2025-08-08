import nodemailer from 'nodemailer'

const sendEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    // secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
    auth: {
      user: 'masumbillah2062003@gmail.com',
      pass: 'bqgk zkid blwa ztdc',
    },
  })

  await transporter.sendMail({
    from: 'masumbillah2062003@gmail.com', // sender address
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
  })
}

export default sendEmail
