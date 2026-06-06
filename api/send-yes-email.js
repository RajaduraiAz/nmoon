import { Resend } from 'resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' })
  }

  const required = ['RESEND_API_KEY', 'MAIL_FROM', 'MAIL_TO']
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    return res.status(500).json({
      ok: false,
      message: `Missing server env vars: ${missing.join(', ')}`,
    })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const {
    noClickCount = 0,
    acceptedAt,
    personName = 'Shruthi',
    nickName = 'Nila',
  } = req.body || {}

  const acceptedTime = acceptedAt || new Date().toISOString()

  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: [process.env.MAIL_TO],
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

    return res.status(200).json({ ok: true })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error?.message || 'Failed to send email',
    })
  }
}
