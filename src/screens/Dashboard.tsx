import { useState } from 'react'
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

type Filter = 'all' | 'active' | 'completed' | 'forfeited'

interface DashboardProps {
  onSelectHabit: (id: string) => void
  onNewHabit: () => void
  isFirstTime?: boolean
}

export default function Dashboard({ onSelectHabit, onNewHabit, isFirstTime = false }: DashboardProps) {
  const [filter, setFilter] = useState<Filter>('all')

  const filteredHabits = HABITS.filter(habit => {
    if (filter === 'all') return true
    if (filter === 'active') return habit.status === 'staked'
    if (filter === 'completed') return habit.status === 'fulfilled'
    if (filter === 'forfeited') return habit.status === 'forfeited'
    return true
  })

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
    <div style={{ padding: '0 16px 32px', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {(['all', 'active', 'completed', 'forfeited'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              borderRadius: '8px',
              border: filter === f ? '1px solid var(--gold)' : '1px solid var(--rule)',
              background: filter === f ? 'var(--gold)' : 'transparent',
              color: filter === f ? 'var(--bg)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Habits list */}
      {filteredHabits.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredHabits.map(h => (
            <HabitCard key={h.id} {...h} onClick={() => onSelectHabit(h.id)} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            No habits found for this filter
          </p>
        </div>
      )}
    </div>
  )
}
