import { useEffect, useState } from "react"

type StampState = "staked" | "fulfilled" | "forfeited"

interface StampBadgeProps {
  state: StampState
  animate?: boolean
  size?: "sm" | "md" | "lg"
}

const labels: Record<StampState, string> = {
  staked: "STAKED",
  fulfilled: "FULFILLED",
  forfeited: "FORFEITED",
}

const colors: Record<StampState, string> = {
  staked: "var(--gold)",
  fulfilled: "var(--green)",
  forfeited: "var(--red)",
}

const sizes = {
  sm: {
    px: "10px 16px",
    fontSize: "10px",
    letterSpacing: "0.12em",
    borderWidth: "1.5px",
  },
  md: {
    px: "12px 20px",
    fontSize: "11px",
    letterSpacing: "0.14em",
    borderWidth: "2px",
  },
  lg: {
    px: "14px 26px",
    fontSize: "13px",
    letterSpacing: "0.16em",
    borderWidth: "2px",
  },
}

export default function StampBadge({
  state,
  animate = false,
  size = "md",
}: StampBadgeProps) {
  const [visible, setVisible] = useState(!animate)
  const s = sizes[size]
  const color = colors[state]

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setVisible(true), 80)
      return () => clearTimeout(t)
    }
  }, [animate])

  return (
    <span
      className={animate && visible ? "stamp-animate" : ""}
      style={{
        display: "inline-block",
        transform: "rotate(-8deg)",
        opacity: animate && !visible ? 0 : 1,
        padding: s.px,
        border: `${s.borderWidth} solid ${color}`,
        borderRadius: "999px",
        color,
        fontFamily: "var(--font-sans)",
        fontSize: s.fontSize,
        fontWeight: 500,
        letterSpacing: s.letterSpacing,
        lineHeight: 1,
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {labels[state]}
    </span>
  )
}
