import { useState } from 'react'
import './App.css'

function App() {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const [saidYes, setSaidYes] = useState(false)
  const [noClickCount, setNoClickCount] = useState(0)
  const [dateAccepted, setDateAccepted] = useState(false)
  const [dateNoClickCount, setDateNoClickCount] = useState(0)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('Evening')
  const [selectedMood, setSelectedMood] = useState('Coffee')
  const [isSending, setIsSending] = useState(false)
  const [apiNotice, setApiNotice] = useState('')

  const noMessages = [
    'Wrong button, Nila. Try again with Yes.',
    'Still the wrong button. You look too cute to pick No.',
    'No worries, I will wait for your Yes.',
    'You found the No button again. Destiny still says Yes.',
    'That No is sweet, but my heart is still waiting for Yes.',
    'Moonlight says you are meant to press Yes.',
    'Nice try, Shruthi. The Yes button is glowing for you.',
    'Even this No sounds like a shy Yes to me.',
    'Let us call this a practice click. Try Yes now.',
    'No accepted as adorable. Please continue to Yes.',
    'You can tap No a hundred times, I will still choose you.',
    'The universe checked twice. It still recommends Yes.',
    'One more chance, Nila. My favorite answer is Yes.',
    'No button works, but the love story starts with Yes.',
  ]

  const responseMessage = saidYes
    ? 'You said Yes. This is my favorite moment ever.'
    : noClickCount > 0
      ? noMessages[(noClickCount - 1) % noMessages.length]
      : 'Pick what your heart says.'

  const dateNoMessages = [
    'Tiny correction, Nila. The date answer is Yes.',
    'Wrong button again. Coffee is waiting for us.',
    'Still cute, still wrong. Try Yes for first date.',
    'My heart says we should click Yes for date.',
    'No worries, take your time and tap Yes.',
  ]

  const formattedDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString()
    : 'your chosen day'

  const dateMessage = dateAccepted
    ? `Perfect. Date set for ${formattedDate}, ${selectedTime} with ${selectedMood}.`
    : dateNoClickCount > 0
      ? dateNoMessages[(dateNoClickCount - 1) % dateNoMessages.length]
      : 'One tiny question more...'

  const handleNo = () => {
    if (!saidYes) {
      setNoClickCount((count) => count + 1)
    }
  }

  const handleDateNo = () => {
    if (!dateAccepted) {
      setDateNoClickCount((count) => count + 1)
    }
  }

  const handleDateYes = () => {
    setDateAccepted(true)
  }

  const handleYes = async () => {
    if (saidYes || isSending) {
      return
    }

    setSaidYes(true)
    setIsSending(true)
    setApiNotice('Sending happy news email...')

    try {
      const response = await fetch(`${apiBaseUrl}/api/send-yes-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noClickCount,
          acceptedAt: new Date().toISOString(),
          personName: 'Shruthi',
          nickName: 'Nila',
        }),
      })

      if (!response.ok) {
        throw new Error('Mail API request failed')
      }

      setApiNotice('Email sent from backend successfully.')
    } catch {
      setApiNotice('Yes received. Could not send email now. Check API URL/backend route.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="page">
      <div className="glow glow-left" aria-hidden="true"></div>
      <div className="glow glow-right" aria-hidden="true"></div>

      <section className="card">
        <figure className="photo-wrap">
          <img className="photo" src="/nila.jpg" alt="Shruthi Nila" />
        </figure>

        <p className="eyebrow">A little note from my heart</p>
        <h1>
          {saidYes
            ? 'You said yes... one more question, my Nila?'
            : 'Shruthi, my Nila... will you be my girlfriend?'}
        </h1>

        {!saidYes && (
          <p className="lead">
            Shruthi, every smile of yours feels like home to me. To your family
            you are Nila, their moon, and to me you are the calm light I always
            look for.
          </p>
        )}

        {!saidYes && (
          <blockquote>
            "Nila, in a world full of noise, your voice is my favorite song."
          </blockquote>
        )}

        {!saidYes && (
          <blockquote>
            "Shruthi, I do not need a perfect day, I just need one with you in
            it."
          </blockquote>
        )}

        {saidYes && (
          <div className="invite">
            <h2>Will you come on our first date?</h2>
            <div className="plan-grid">
              <label className="field">
                Date
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </label>

              <label className="field">
                Time
                <select
                  value={selectedTime}
                  onChange={(event) => setSelectedTime(event.target.value)}
                >
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </label>
            </div>

            <p className="mood-title">Mood</p>
            <div className="mood-options">
              {['Movie', 'Coffee', 'Live Music', 'Dinner', 'Beach Walk'].map((mood) => (
                <button
                  key={mood}
                  type="button"
                  className={`mood-chip ${selectedMood === mood ? 'active' : ''}`}
                  onClick={() => setSelectedMood(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        )}

        {!saidYes ? (
          <div className="actions">
            <button type="button" className="yes" onClick={handleYes} disabled={isSending}>
              Yes, I would love to
            </button>
            <button type="button" className="soft" onClick={handleNo} disabled={isSending}>
              No, wrong button, try again
            </button>
          </div>
        ) : (
          <div className="actions">
            <button type="button" className="yes" onClick={handleDateYes}>
              Yes, first date with you
            </button>
            <button type="button" className="soft" onClick={handleDateNo}>
              No, wrong button again
            </button>
          </div>
        )}

        <p className="status" aria-live="polite">
          {saidYes ? dateMessage : responseMessage}
        </p>

        <p className="hint" aria-live="polite">
          {apiNotice}
        </p>
      </section>
      <p className="footer">Made with love, for Shruthi, my Nila.</p>
    </main>
  )
}

export default App
