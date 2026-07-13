import { useState } from 'react'
import StampBadge from '../components/StampBadge'
import StreakHeatmap from '../components/StreakHeatmap'
import CheckinButton from '../components/CheckinButton'

const makeStreak = (total: number, filled: number) =>
  Array.from({ length: total }, (_, i) => i < filled)

export default function HabitDetail({ onBack }: { onBack: () => void }) {
  const [days, setDays] = useState(makeStreak(30, 14))
  const [checkedInToday, setCheckedInToday] = useState(false)

  const handleCheckin = () => {
    setCheckedInToday(true)
    setDays(prev => {
      const next = [...prev]
      const idx = next.findIndex(d => !d)
      if (idx !== -1) next[idx] = true
      return next
    })
  }

  const completed = days.filter(Boolean).length

  return (
    <div style={{ padding: '0 20px 40px', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 500,
            color: 'var(--text)',
            margin: 0,
            lineHeight: 1.2,
          }}>
            Morning Pages
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: '6px 0 0', letterSpacing: '0.03em' }}>
            Write 3 pages longhand every morning
          </p>
        </div>
        <StampBadge state="staked" size="md" />
      </div>

      {/* Streak card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: '10px', padding: '20px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            30-Day Streak
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--gold)' }}>
            {completed}/30
          </span>
        </div>
        <StreakHeatmap days={days} completed={false} />
      </div>

      {/* Stats row */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--rule)',
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '14px',
      }}>
        {[
          { label: 'Current Streak', value: '14', unit: 'days' },
          { label: 'Best Streak', value: '14', unit: 'days' },
          { label: 'Completion', value: Math.round((completed / 30) * 100).toString(), unit: '%' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '3px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 500, color: 'var(--text)' }}>{stat.value}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)' }}>{stat.unit}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0', letterSpacing: '0.03em' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Stake info */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: '10px', padding: '20px', marginBottom: '14px' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 12px' }}>
          Stake Details
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 500, color: 'var(--gold)' }}>500</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginLeft: '8px' }}>XLM</span>
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>≈ $47.50 USD</span>
        </div>

        <div style={{ borderTop: '1px solid var(--rule)', marginTop: '14px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.04em' }}>CHARITY ON FAILURE</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text)', margin: '4px 0 0' }}>GiveWell Top Charities</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.04em' }}>END DATE</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)', margin: '4px 0 0' }}>2026-08-11</p>
          </div>
        </div>
      </div>

      <CheckinButton checkedInToday={checkedInToday} onCheckin={handleCheckin} />
    </div>
  )
}
