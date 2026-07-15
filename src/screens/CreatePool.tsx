import { useState } from 'react'
import StakeAmountSlider from '../components/StakeAmountSlider'
import CharityPicker from '../components/CharityPicker'
import { savePool, joinPool } from '../lib/poolStorage'
import { api } from '../lib/api'

interface CreatePoolProps {
  onCancel: () => void
  onCreate: () => void
}

type Step = 'habit' | 'stake' | 'rules' | 'confirm'

const STEPS: Step[] = ['habit', 'stake', 'rules', 'confirm']
const STEP_LABELS: Record<Step, string> = {
  habit: 'Define Pool',
  stake: 'Set Stake',
  rules: 'Pool Rules',
  confirm: 'Confirm',
}

export default function CreatePool({ onCancel, onCreate }: CreatePoolProps) {
  const [step, setStep] = useState<Step>('habit')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(30)
  const [amount, setAmount] = useState(50)
  const [currency, setCurrency] = useState<'XLM' | 'USDC'>('XLM')
  const [maxParticipants, setMaxParticipants] = useState(10)
  const [charity, setCharity] = useState<string | null>(null)
  const [winnerSplit, setWinnerSplit] = useState(60)

  const stepIdx = STEPS.indexOf(step)

  const canNext =
    step === 'habit' ? title.trim().length > 0 :
    step === 'stake' ? amount > 0 :
    step === 'rules' ? charity !== null :
    true

  const inputStyle = {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--rule)',
    borderRadius: '8px',
    padding: '12px 14px',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  const charityNames: Record<string, string> = {
    givewell: 'GiveWell Top Charities',
    ef: 'Evidence Action',
    gd: 'GiveDirectly',
    clean: 'Clean Air Task Force',
    sea: 'Sea Shepherd',
    acl: 'ACLU Foundation',
  }

  return (
    <div style={{ padding: '0 16px 32px', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
            <div style={{
              height: '2px',
              width: '100%',
              background: i <= stepIdx ? 'var(--gold)' : 'var(--rule)',
              borderRadius: '1px',
              transition: 'background 0.2s',
            }} />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              letterSpacing: '0.06em',
              color: i <= stepIdx ? 'var(--gold)' : 'var(--text-muted)',
              textTransform: 'uppercase',
            }}>
              {STEP_LABELS[s]}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: '10px', padding: '24px', marginBottom: '14px' }}>

        {step === 'habit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>
              What's the pool challenge?
            </h3>
            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Pool name
              </label>
              <input
                type="text"
                placeholder="e.g. Morning Pages Challenge"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--gold)'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--rule)'}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Description (optional)
              </label>
              <textarea
                placeholder="Describe the habit challenge for this pool"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-sans)' }}
                onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--gold)'}
                onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--rule)'}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                Duration
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[14, 21, 30, 60, 90].map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    style={{
                      flex: 1,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: `1px solid ${duration === d ? 'var(--gold)' : 'var(--rule)'}`,
                      background: duration === d ? 'color-mix(in srgb, var(--gold) 12%, var(--surface))' : 'transparent',
                      color: duration === d ? 'var(--gold)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                Max Participants
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[5, 10, 15, 20].map(p => (
                  <button
                    key={p}
                    onClick={() => setMaxParticipants(p)}
                    style={{
                      flex: 1,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: `1px solid ${maxParticipants === p ? 'var(--gold)' : 'var(--rule)'}`,
                      background: maxParticipants === p ? 'color-mix(in srgb, var(--gold) 12%, var(--surface))' : 'transparent',
                      color: maxParticipants === p ? 'var(--gold)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'stake' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500, color: 'var(--text)', margin: '0 0 8px' }}>
              How much per participant?
            </h3>
            <StakeAmountSlider
              value={amount}
              currency={currency}
              onChange={(v, c) => { setAmount(v); setCurrency(c) }}
            />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.6 }}>
              Each participant will stake this amount. Total pot = {amount} × {maxParticipants} = {(amount * maxParticipants).toLocaleString()} {currency}
            </p>
          </div>
        )}

        {step === 'rules' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>
              Pool Rules
            </h3>
            
            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                Winner Split (% of forfeited stakes)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[50, 60, 70, 80].map(split => (
                  <button
                    key={split}
                    onClick={() => setWinnerSplit(split)}
                    style={{
                      flex: 1,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: `1px solid ${winnerSplit === split ? 'var(--gold)' : 'var(--rule)'}`,
                      background: winnerSplit === split ? 'color-mix(in srgb, var(--gold) 12%, var(--surface))' : 'transparent',
                      color: winnerSplit === split ? 'var(--gold)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {split}%
                  </button>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                Winners split {winnerSplit}% of forfeited stakes. Remaining {100 - winnerSplit}% goes to charity.
              </p>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Charity for forfeited stakes
              </label>
              <CharityPicker selected={charity} onSelect={setCharity} />
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>
              Review your pool
            </h3>

            {[
              { label: 'Pool name', value: title || 'Morning Pages Challenge' },
              { label: 'Duration', value: `${duration} days` },
              { label: 'Max participants', value: maxParticipants.toString() },
              { label: 'Stake per person', value: `${amount.toLocaleString()} ${currency}` },
              { label: 'Total pot potential', value: `${(amount * maxParticipants).toLocaleString()} ${currency}` },
              { label: 'Winner split', value: `${winnerSplit}%` },
              { label: 'Charity', value: charity ? charityNames[charity] : '—' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--rule)', paddingBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {row.label}
                </span>
                <span style={{ fontFamily: row.label.includes('Stake') || row.label.includes('pot') ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: '14px', color: row.label.includes('Stake') || row.label.includes('pot') ? 'var(--gold)' : 'var(--text)', fontWeight: 500 }}>
                  {row.value}
                </span>
              </div>
            ))}

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              By creating this pool, you authorize the Soroban contract to lock <strong style={{ color: 'var(--text)' }}>{amount.toLocaleString()} {currency}</strong> from your wallet as the first stake. Other participants can join until the pool is full.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={stepIdx === 0 ? onCancel : () => setStep(STEPS[stepIdx - 1])}
          style={{
            flex: 1,
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid var(--rule)',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          {stepIdx === 0 ? 'Cancel' : '← Back'}
        </button>

        <button
          onClick={async () => {
            if (step === 'confirm') {
              try {
                const pool = await savePool({
                  title,
                  description,
                  duration,
                  stake_amount: amount.toFixed(7),
                  currency,
                  max_participants: maxParticipants,
                  winner_split: winnerSplit,
                  charity: charity || 'givewell',
                  status: 'active',
                  creator_address: 'GBXT...FQNK',
                })
                await joinPool(pool.id, 'GBXT...FQNK')
                onCreate()
              } catch (error) {
                alert('Failed to create pool: ' + (error as Error).message)
              }
            } else {
              setStep(STEPS[stepIdx + 1])
            }
          }}
          disabled={!canNext}
          style={{
            flex: 2,
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '12px',
            borderRadius: '10px',
            border: `1px solid ${canNext ? 'var(--gold)' : 'var(--rule)'}`,
            background: canNext ? 'var(--gold)' : 'transparent',
            color: canNext ? 'var(--bg)' : 'var(--text-muted)',
            cursor: canNext ? 'pointer' : 'not-allowed',
            opacity: canNext ? 1 : 0.5,
            transition: 'all 0.15s',
          }}
        >
          {step === 'confirm' ? 'Create Pool →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}
