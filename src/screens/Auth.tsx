import { useState } from "react"
import { api } from "../lib/api"

interface AuthProps {
  onAuthSuccess: () => void
}

type AuthMode = "login" | "register"

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "login") {
        const response = await api.login(email, password)
        api.setToken(response.access_token)
      } else {
        const response = await api.register(email, password)
        api.setToken(response.access_token)
      }
      onAuthSuccess()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--rule)",
    borderRadius: "8px",
    padding: "12px 14px",
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 0.15s",
  }

  return (
    <div
      style={{
        padding: "0 16px 32px",
        maxWidth: "400px",
        width: "100%",
        margin: "0 auto",
        paddingTop: "40px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "40px",
            transform: "rotate(-8deg)",
            display: "inline-block",
            userSelect: "none",
            marginBottom: "12px",
          }}
        >
          ◈
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            fontWeight: 500,
            color: "var(--text)",
            margin: "0 0 6px",
          }}
        >
          {mode === "login" ? "Welcome Back" : "Join StakeHabit"}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            color: "var(--text-muted)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {mode === "login"
            ? "Sign in to access your stakes and pools"
            : "Create an account to start staking"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            placeholder="you@example.com"
            onFocus={(e) =>
              ((e.target as HTMLInputElement).style.borderColor = "var(--gold)")
            }
            onBlur={(e) =>
              ((e.target as HTMLInputElement).style.borderColor = "var(--rule)")
            }
          />
        </div>

        <div>
          <label
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ ...inputStyle, paddingRight: "44px" }}
              placeholder="••••••••"
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor =
                  "var(--gold)")
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor =
                  "var(--rule)")
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
                fontSize: "12px",
                fontFamily: "var(--font-sans)",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "color-mix(in srgb, var(--red) 12%, var(--surface))",
              border: "1px solid var(--red)",
              color: "var(--red)",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "14px 20px",
            borderRadius: "10px",
            border: "1px solid var(--gold)",
            background: loading ? "transparent" : "var(--gold)",
            color: loading ? "var(--text-muted)" : "var(--bg)",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.15s",
          }}
        >
          {loading
            ? "Processing..."
            : mode === "login"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login")
            setError("")
          }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <span style={{ color: "var(--gold)", textDecoration: "none" }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </button>
      </div>
    </div>
  )
}
