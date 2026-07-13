import StampBadge from './StampBadge'
import StreakHeatmap from './StreakHeatmap'

type StampState = 'staked' | 'fulfilled' | 'forfeited'

interface HabitCardProps {
  title: string
  subtitle: string
  days: boolean[]
  status: StampState
  amount: number
  currency: 'XLM' | 'USDC'
  charity: string
  onClick?: () => void
}

export default function HabitCard({
  title, subtitle, days, status, amount, currency, charity, onClick
}: HabitCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: 'var(--surface)',
        border: '1px solid var(--rule)',
        borderRadius: '10px',
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 500,
            color: 'var(--text)',
            margin: 0,
            lineHeight: 1.2,
          }}>
            {title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            margin: '4px 0 0',
            letterSpacing: '0.03em',
          }}>
            {subtitle}
          </p>
        </div>
        <StampBadge state={status} size="sm" />
      </div>

      <div style={{ marginTop: '14px' }}>
        <StreakHeatmap days={days} completed={status === 'fulfilled'} />
      </div>

      <div style={{
        borderTop: '1px solid var(--rule)',
        marginTop: '14px',
        paddingTop: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '20px',
            fontWeight: 500,
            color: status === 'staked' ? 'var(--gold)' : status === 'fulfilled' ? 'var(--green)' : 'var(--red)',
          }}>
            {amount.toLocaleString()}
          </span>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginLeft: '6px',
            letterSpacing: '0.04em',
          }}>
            {currency}
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          letterSpacing: '0.03em',
        }}>
          → {charity}
        </span>
      </div>
    </button>
  )
}
