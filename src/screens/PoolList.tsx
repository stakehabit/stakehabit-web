import { useEffect, useState } from 'react'
import { getPools } from '../lib/poolStorage'
import type { Pool } from '../lib/poolStorage'

interface PoolListProps {
  onSelectPool: (id: number) => void
  onCreatePool: () => void
}

export default function PoolList({ onSelectPool, onCreatePool }: PoolListProps) {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPools() {
      setLoading(true)
      try {
        const data = await getPools()
        setPools(data)
      } catch (error) {
        console.error('Failed to load pools:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPools()
  }, [])

  const activePools = pools.filter(p => p.status === 'active')
  const completedPools = pools.filter(p => p.status === 'completed')

  if (loading) {
    return (
      <div style={{ padding: '0 20px 40px', maxWidth: '600px', width: '100%', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)' }}>Loading pools...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 20px 40px', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 500, color: 'var(--text)', margin: '0 0 8px' }}>
          Staking Pools
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Compete with others. Complete your habit to share in the forfeited stakes.
        </p>
      </div>

      {activePools.length > 0 && (
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
            Active Pools
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activePools.map(pool => {
              const stakeAmount = parseFloat(pool.stake_amount)
              const totalPot = stakeAmount * (pool.currentParticipants || 0)
              const subtitle = `${pool.currentParticipants || 0} participants · ${pool.duration} days · ${totalPot.toFixed(2)} ${pool.currency} pot`
              
              return (
                <button
                  key={pool.id}
                  onClick={() => onSelectPool(pool.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'var(--surface)',
                    border: '1px solid var(--rule)',
                    borderRadius: '10px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)'}
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
                        {pool.title}
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
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      background: 'color-mix(in srgb, var(--gold) 12%, var(--surface))',
                      border: '1px solid var(--gold)',
                      color: 'var(--gold)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                    }}>
                      {pool.currentParticipants || 0}/{pool.max_participants}
                    </div>
                  </div>

                  <div style={{ marginTop: '14px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {pool.days.slice(0, 14).map((checked, i) => (
                        <div
                          key={i}
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '2px',
                            backgroundColor: checked ? 'var(--gold)' : 'var(--rule)',
                            opacity: checked ? 1 : 0.6,
                          }}
                        />
                      ))}
                    </div>
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
                        color: 'var(--gold)',
                      }}>
                        {totalPot.toLocaleString()}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        marginLeft: '6px',
                        letterSpacing: '0.04em',
                      }}>
                        {pool.currency} pot
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      color: 'var(--green)',
                      letterSpacing: '0.03em',
                    }}>
                      Winners split forfeits →
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {completedPools.length > 0 && (
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
            Completed Pools
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {completedPools.map(pool => {
              const stakeAmount = parseFloat(pool.stake_amount)
              const totalPot = stakeAmount * (pool.currentParticipants || 0)
              const subtitle = `Completed · ${pool.currentParticipants || 0} participants · ${totalPot.toFixed(2)} ${pool.currency} distributed`
              
              return (
                <button
                  key={pool.id}
                  onClick={() => onSelectPool(pool.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'var(--surface)',
                    border: '1px solid var(--rule)',
                    borderRadius: '10px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                    opacity: 0.8,
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)'}
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
                        {pool.title}
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
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      background: 'color-mix(in srgb, var(--green) 12%, var(--surface))',
                      border: '1px solid var(--green)',
                      color: 'var(--green)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                    }}>
                      COMPLETED
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      <button
        onClick={onCreatePool}
        style={{
          width: '100%',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '14px 20px',
          borderRadius: '10px',
          border: '1px dashed var(--rule)',
          background: 'transparent',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          const target = e.currentTarget as HTMLElement
          target.style.borderColor = 'var(--gold)'
          target.style.color = 'var(--gold)'
        }}
        onMouseLeave={e => {
          const target = e.currentTarget as HTMLElement
          target.style.borderColor = 'var(--rule)'
          target.style.color = 'var(--text-muted)'
        }}
      >
        + Create New Pool
      </button>
    </div>
  )
}
