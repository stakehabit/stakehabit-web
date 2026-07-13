import HabitCard from '../components/HabitCard'

const makeStreak = (total: number, filled: number) =>
  Array.from({ length: total }, (_, i) => i < filled)

const HABITS = [
  {
    id: 'morning-pages',
    title: 'Morning Pages',
    subtitle: 'Day 14 of 30 · in progress',
    days: makeStreak(30, 14),
    status: 'staked' as const,
    amount: 500,
    currency: 'XLM' as const,
    charity: 'GiveWell',
  },
  {
    id: 'no-sugar',
    title: 'No Refined Sugar',
    subtitle: 'Completed · 21 of 21 days',
    days: makeStreak(21, 21),
    status: 'fulfilled' as const,
    amount: 250,
    currency: 'XLM' as const,
    charity: 'GiveDirectly',
  },
  {
    id: 'cold-shower',
    title: 'Cold Shower Daily',
    subtitle: 'Forfeited · 8 of 14 days · redirected',
    days: [...makeStreak(8, 8), ...makeStreak(6, 0)],
    status: 'forfeited' as const,
    amount: 100,
    currency: 'USDC' as const,
    charity: 'Clean Air Task Force',
  },
]

interface DashboardProps {
  onSelectHabit: (id: string) => void
  onNewHabit: () => void
  isFirstTime?: boolean
}

export default function Dashboard({ onSelectHabit, onNewHabit, isFirstTime = false }: DashboardProps) {
  const active = HABITS.filter(h => h.status === 'staked')
  const past = HABITS.filter(h => h.status !== 'staked')

  if (isFirstTime) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', transform: 'rotate(-8deg)', display: 'inline-block', userSelect: 'none' }}>◈</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>
          No stakes yet
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', margin: 0, maxWidth: '280px', lineHeight: 1.7 }}>
          Lock XLM or USDC against a habit. Get it back when you succeed. It goes to charity if you don't.
        </p>
        <button
          onClick={onNewHabit}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '12px 28px',
            borderRadius: '10px',
            border: '1px solid var(--gold)',
            background: 'var(--gold)',
            color: 'var(--bg)',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Start your first stake
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 20px 40px', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
      {active.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            margin: '0 0 12px',
          }}>
            Active Stakes
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {active.map(h => (
              <HabitCard key={h.id} {...h} onClick={() => onSelectHabit(h.id)} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            margin: '0 0 12px',
          }}>
            Past Stakes
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {past.map(h => (
              <HabitCard key={h.id} {...h} onClick={() => onSelectHabit(h.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
