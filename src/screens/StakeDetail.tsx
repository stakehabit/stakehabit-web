import { useEffect, useState } from 'react'
import StampBadge from '../components/StampBadge'

const TX_HISTORY = [
  { hash: 'a3f9d2...b74c', action: 'Stake locked', date: '2026-07-12', amount: '+500 XLM', type: 'staked' },
  { hash: 'c71e3a...92df', action: 'Check-in confirmed', date: '2026-07-13', amount: '—', type: 'checkin' },
  { hash: 'f82b1c...56ae', action: 'Check-in confirmed', date: '2026-07-14', amount: '—', type: 'checkin' },
]

function useCountdown(targetDate: Date) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) { setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setRemaining({ days, hours, minutes, seconds })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return remaining
}

export default function StakeDetail({ onBack }: { onBack: () => void }) {
  const endDate = new Date('2026-08-11T00:00:00')
  const remaining = useCountdown(endDate)
  const [showStamp, setShowStamp] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowStamp(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ padding: '0 20px 40px', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 500, color: 'var(--text)', margin: 0, lineHeight: 1.2 }}>
            Morning Pages
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 0', letterSpacing: '0.04em' }}>
            Stake #SH-2026-0042
          </p>
        </div>
        {showStamp && <StampBadge state="staked" size="lg" animate={true} />}
      </div>

      {/* Countdown */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: '10px', padding: '24px', marginBottom: '8px' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 16px' }}>
          Time Remaining
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
          {[
            { value: remaining.days, label: 'Days' },
            { value: remaining.hours, label: 'Hours' },
            { value: remaining.minutes, label: 'Minutes' },
            { value: remaining.seconds, label: 'Seconds' },
          ].map(({ value, label }) => (
            <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--rule)', borderRadius: '8px', padding: '12px 8px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 500, color: 'var(--gold)', lineHeight: 1 }}>
                {String(value).padStart(2, '0')}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--rule)', marginTop: '16px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>End date</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)' }}>2026-08-11</span>
        </div>
      </div>

      {/* Amount */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: '10px', padding: '20px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 8px' }}>
              Locked Amount
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 500, color: 'var(--gold)' }}>500</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: 'var(--text-muted)' }}>XLM</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px', letterSpacing: '0.04em' }}>CHARITY ON FAILURE</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text)', margin: 0 }}>GiveWell Top Charities</p>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: '10px', padding: '20px', marginBottom: '8px' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 14px' }}>
          Transaction History
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {TX_HISTORY.map((tx, i) => (
            <div
              key={tx.hash}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < TX_HISTORY.length - 1 ? '1px solid var(--rule)' : 'none',
              }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text)', margin: 0 }}>{tx.action}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                  <a
                    href={`https://stellar.expert/explorer/public/tx/${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--gold)', textDecoration: 'none' }}
                  >
                    {tx.hash}
                  </a>
                  {' · '}{tx.date}
                </p>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: tx.type === 'staked' ? 'var(--gold)' : 'var(--text-muted)',
              }}>
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contract link */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: '10px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>Soroban contract</span>
          <a
            href="https://stellar.expert"
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)', textDecoration: 'none' }}
          >
            CBXQ...7MNP ↗
          </a>
        </div>
      </div>
    </div>
  )
}
