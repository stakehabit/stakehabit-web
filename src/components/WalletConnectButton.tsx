import { useState } from 'react'

type WalletState = 'disconnected' | 'connecting' | 'connected'

export default function WalletConnectButton() {
  const [walletState, setWalletState] = useState<WalletState>('disconnected')
  const address = 'GBXT...FQNK'

  const handleClick = () => {
    if (walletState === 'disconnected') {
      setWalletState('connecting')
      setTimeout(() => setWalletState('connected'), 1200)
    } else if (walletState === 'connected') {
      setWalletState('disconnected')
    }
  }

  const label =
    walletState === 'connected' ? address :
    walletState === 'connecting' ? 'Connecting…' :
    'Connect Freighter'

  const color = walletState === 'connected' ? 'var(--green)' : 'var(--gold)'

  return (
    <button
      onClick={handleClick}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        fontWeight: 400,
        color,
        background: 'transparent',
        border: `1px solid ${color}`,
        borderRadius: '999px',
        padding: '6px 14px',
        cursor: walletState === 'connecting' ? 'default' : 'pointer',
        letterSpacing: '0.04em',
        opacity: walletState === 'connecting' ? 0.7 : 1,
        transition: 'opacity 0.15s, color 0.2s, border-color 0.2s',
      }}
      disabled={walletState === 'connecting'}
    >
      {label}
    </button>
  )
}
