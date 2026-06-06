import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import nodemailer from 'nodemailer'

const app = express()
const port = process.env.PORT || 8787

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/send-yes-email', async (req, res) => {
  const { noClickCount = 0, acceptedAt, personName = 'Shruthi', nickName = 'Nila' } = req.body || {}

  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'MAIL_TO']
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    return res.status(500).json({
      ok: false,
      message: `Missing server env vars: ${missing.join(', ')}`,
    })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const acceptedTime = acceptedAt || new Date().toISOString()

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `She said YES - ${personName} (${nickName})`,
      text: [
        'Great news. She clicked Yes.',
        '',
        `Name: ${personName}`,
        `Nickname: ${nickName}`,
        `No button clicks: ${noClickCount}`,
        `Accepted at: ${acceptedTime}`,
      ].join('\n'),
    })

    return res.json({ ok: true })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error?.message || 'Failed to send email',
    })
  }
})

app.listen(port, () => {
  console.log(`Mail backend listening on http://localhost:${port}`)
})
