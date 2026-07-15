import { useEffect, useState } from "react"
import WalletConnectButton from "./components/WalletConnectButton"
import Dashboard from "./screens/Dashboard"
import HabitDetail from "./screens/HabitDetail"
import NewHabit from "./screens/NewHabit"
import StakeDetail from "./screens/StakeDetail"
import PoolList from "./screens/PoolList"
import PoolDetail from "./screens/PoolDetail"
import CreatePool from "./screens/CreatePool"
import Auth from "./screens/Auth"
import { api } from "./lib/api"

type Screen = "dashboard" | "habit-detail" | "new-habit" | "stake-detail" | "pools" | "pool-detail" | "create-pool" | "auth"

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("stakehabit-theme")
    return saved as "dark" | "light" ?? "dark"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("stakehabit-theme", theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"))
  return { theme, toggle }
}

export default function App() {
  const { theme, toggle } = useTheme()
  const [screen, setScreen] = useState<Screen>("auth")
  const [, setSelectedHabit] = useState<string | null>(null)
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(null)
  const [, setShowStakeSuccess] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [poolRefreshTrigger, setPoolRefreshTrigger] = useState(0)

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setScreen("dashboard")
  }

  const handleLogout = () => {
    api.setToken(null)
    setIsAuthenticated(false)
    setScreen("auth")
  }

  const screenTitles: Record<Screen, string> = {
    dashboard: "StakeHabit",
    "habit-detail": "Habit Detail",
    "new-habit": "New Stake",
    "stake-detail": "Stake Detail",
    pools: "Staking Pools",
    "pool-detail": "Pool Detail",
    "create-pool": "Create Pool",
    auth: "Sign In",
  }

  const handleSelectHabit = (id: string) => {
    setSelectedHabit(id)
    setScreen(id === "morning-pages" ? "habit-detail" : "stake-detail")
  }

  const handleNewHabitCreated = () => {
    setShowStakeSuccess(true)
    setScreen("stake-detail")
    setTimeout(() => setShowStakeSuccess(false), 3000)
  }

  const handleSelectPool = (id: number) => {
    setSelectedPoolId(id)
    setScreen("pool-detail")
  }

  const handlePoolCreated = () => {
    setPoolRefreshTrigger((prev) => prev + 1)
    setScreen("pools")
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--rule)",
          padding: "0 20px",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          backgroundColor: "var(--bg)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {screen !== "dashboard" && (
            <button
              onClick={() => setScreen("dashboard")}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "var(--text-muted)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
                letterSpacing: "0.02em",
              }}
            >
              ← Back
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {screen === "dashboard" && (
              <span
                style={{
                  fontSize: "16px",
                  transform: "rotate(-8deg)",
                  display: "inline-block",
                  userSelect: "none",
                }}
              >
                ◈
              </span>
            )}
            <h1
              style={{
                fontFamily:
                  screen === "dashboard"
                    ? "var(--font-display)"
                    : "var(--font-sans)",
                fontSize: screen === "dashboard" ? "18px" : "14px",
                fontWeight: screen === "dashboard" ? 500 : 400,
                color: "var(--text)",
                margin: 0,
                letterSpacing: screen === "dashboard" ? "0" : "0.04em",
              }}
            >
              {screenTitles[screen]}
            </h1>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            style={{
              width: "32px",
              height: "18px",
              borderRadius: "999px",
              border: "1px solid var(--rule)",
              background: "var(--surface)",
              cursor: "pointer",
              position: "relative",
              padding: 0,
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "var(--gold)",
                position: "absolute",
                top: "2px",
                left: theme === "dark" ? "2px" : "16px",
                transition: "left 0.2s",
              }}
            />
          </button>

          {isAuthenticated ? (
            <>
              <WalletConnectButton />
              {screen === "dashboard" && (
                <>
                  <button
                    onClick={() => setScreen("pools")}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--rule)",
                      background: "transparent",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    Pools
                  </button>
                  <button
                    onClick={() => setScreen("new-habit")}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--gold)",
                      background: "var(--gold)",
                      color: "var(--bg)",
                      cursor: "pointer",
                    }}
                  >
                    + New
                  </button>
                </>
              )}
              <button
                onClick={handleLogout}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--rule)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <WalletConnectButton />
          )}
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          paddingTop: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {screen === "auth" && <Auth onAuthSuccess={handleAuthSuccess} />}
        {screen === "dashboard" && (
          <Dashboard
            onSelectHabit={handleSelectHabit}
            onNewHabit={() => setScreen("new-habit")}
          />
        )}
        {screen === "habit-detail" && (
          <HabitDetail onBack={() => setScreen("dashboard")} />
        )}
        {screen === "new-habit" && (
          <NewHabit
            onCancel={() => setScreen("dashboard")}
            onCreate={handleNewHabitCreated}
          />
        )}
        {screen === "stake-detail" && (
          <StakeDetail onBack={() => setScreen("dashboard")} />
        )}
        {screen === "pools" && (
          <PoolList
            onSelectPool={handleSelectPool}
            onCreatePool={() => setScreen("create-pool")}
            refreshTrigger={poolRefreshTrigger}
          />
        )}
        {screen === "pool-detail" && (
          <PoolDetail
            poolId={selectedPoolId || undefined}
            onBack={() => {
              setPoolRefreshTrigger((prev) => prev + 1)
              setScreen("pools")
            }}
          />
        )}
        {screen === "create-pool" && (
          <CreatePool
            onCancel={() => setScreen("pools")}
            onCreate={handlePoolCreated}
          />
        )}
      </main>

      {/* Footer ledger rule */}
      <footer
        style={{
          borderTop: "1px solid var(--rule)",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          StakeHabit · Stellar / Soroban
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-muted)",
          }}
        >
          Testnet
        </span>
      </footer>
    </div>
  )
}
