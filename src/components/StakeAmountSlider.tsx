import { useState } from 'react'

interface StakeAmountSliderProps {
  value: number
  currency: 'XLM' | 'USDC'
  onChange: (value: number, currency: 'XLM' | 'USDC') => void
}

export default function StakeAmountSlider({ value, currency, onChange }: StakeAmountSliderProps) {
  const [cur, setCur] = useState(currency)
  const max = cur === 'XLM' ? 5000 : 500

  const handleCurrencyToggle = (c: 'XLM' | 'USDC') => {
    setCur(c)
    const scaled = c === 'USDC' ? Math.round(value / 10) : value * 10
    onChange(Math.min(scaled, c === 'XLM' ? 5000 : 500), c)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          STAKE AMOUNT
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['XLM', 'USDC'] as const).map(c => (
            <button
              key={c}
              onClick={() => handleCurrencyToggle(c)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: '999px',
                border: `1px solid ${cur === c ? 'var(--gold)' : 'var(--rule)'}`,
                background: cur === c ? 'var(--gold)' : 'transparent',
                color: cur === c ? 'var(--bg)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.06em',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '34px',
          fontWeight: 500,
          color: 'var(--gold)',
          lineHeight: 1,
        }}>
          {value.toLocaleString()}
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: 'var(--text-muted)' }}>
          {cur}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={max}
        step={cur === 'XLM' ? 50 : 5}
        value={value}
        onChange={e => onChange(Number(e.target.value), cur)}
        style={{
          width: '100%',
          accentColor: 'var(--gold)',
          cursor: 'pointer',
          height: '3px',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>0</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{max.toLocaleString()} {cur}</span>
      </div>
    </div>
  )
}
