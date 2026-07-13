interface CheckinButtonProps {
  checkedInToday: boolean
  onCheckin: () => void
}

export default function CheckinButton({ checkedInToday, onCheckin }: CheckinButtonProps) {
  return (
    <button
      onClick={!checkedInToday ? onCheckin : undefined}
      disabled={checkedInToday}
      style={{
        width: '100%',
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: '0.06em',
        padding: '14px 20px',
        borderRadius: '10px',
        border: checkedInToday ? '1px solid var(--rule)' : '1px solid var(--gold)',
        background: checkedInToday ? 'transparent' : 'var(--gold)',
        color: checkedInToday ? 'var(--text-muted)' : 'var(--bg)',
        cursor: checkedInToday ? 'not-allowed' : 'pointer',
        opacity: checkedInToday ? 0.7 : 1,
        transition: 'opacity 0.15s, background 0.2s',
        textTransform: 'uppercase',
      }}
    >
      {checkedInToday ? '✓ Checked in today' : 'Check In — Day Complete'}
    </button>
  )
}
