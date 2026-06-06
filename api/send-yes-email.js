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
    eventType = 'girlfriend-yes',
    noClickCount = 0,
    acceptedAt,
    personName = 'Shruthi',
    nickName = 'Nila',
    dateChoice,
  } = req.body || {}

  const acceptedTime = acceptedAt || new Date().toISOString()
  const isDateEvent = eventType === 'first-date-yes'
  const subject = isDateEvent
    ? `First Date Confirmed - ${personName} (${nickName})`
    : `She said YES - ${personName} (${nickName})`

  const textLines = isDateEvent
    ? [
        'Great news. She confirmed the first date.',
        '',
        `Name: ${personName}`,
        `Nickname: ${nickName}`,
        `Chosen date: ${dateChoice?.date || 'Not selected'}`,
        `Chosen time: ${dateChoice?.time || 'Not selected'}`,
        `Chosen mood: ${dateChoice?.mood || 'Not selected'}`,
        `Girlfriend No button clicks before Yes: ${noClickCount}`,
        `Confirmed at: ${acceptedTime}`,
      ]
    : [
        'Great news. She clicked Yes.',
        '',
        `Name: ${personName}`,
        `Nickname: ${nickName}`,
        `No button clicks: ${noClickCount}`,
        `Accepted at: ${acceptedTime}`,
      ]

  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: [process.env.MAIL_TO],
      subject,
      text: textLines.join('\n'),
    })

    return res.status(200).json({ ok: true })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error?.message || 'Failed to send email',
    })
  }
}
