import { useState, useEffect } from "react"
import StampBadge from "../components/StampBadge"
import CheckinButton from "../components/CheckinButton"
import {
  getPool,
  getPoolParticipants,
  joinPool,
  poolCheckin,
  getPoolCheckins,
} from "../lib/poolStorage"
import type { Pool, Participant } from "../lib/poolStorage"

interface PoolDetailProps {
  poolId?: number
  onBack: () => void
}

export default function PoolDetail({ poolId, onBack }: PoolDetailProps) {
  const [pool, setPool] = useState<Pool | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [days, setDays] = useState<boolean[]>([])
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(true)
  const [walletAddress] = useState("GBXT...FQNK") // Would come from wallet

  useEffect(() => {
    async function loadPoolData() {
      if (!poolId) return

      setLoading(true)
      try {
        const [poolData, participantsData, checkinsData] = await Promise.all([
          getPool(poolId),
          getPoolParticipants(poolId),
          getPoolCheckins(poolId, walletAddress),
        ])

        if (poolData) {
          setPool(poolData)

          // Build days array from check-ins
          const daysArray = Array.from(
            { length: poolData.duration },
            () => false,
          )
          checkinsData.forEach((checkin: any) => {
            const checkinDate = new Date(checkin.check_in_date)
            const startDate = new Date(poolData.created_at.split("T")[0])
            const dayIndex = Math.floor(
              (checkinDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24),
            )
            if (dayIndex >= 0 && dayIndex < daysArray.length) {
              daysArray[dayIndex] = true
            }
          })
          setDays(daysArray)

          // Check if user has joined
          const hasJoined = participantsData.some(
            (p) => p.wallet_address === walletAddress,
          )
          setJoined(hasJoined)

          // Check if already checked in today
          const today = new Date().toISOString().split("T")[0]
          const checkedToday = checkinsData.some(
            (c: any) => c.check_in_date === today,
          )
          setCheckedInToday(checkedToday)
        }

        setParticipants(participantsData)
      } catch (error) {
        console.error("Failed to load pool data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPoolData()
  }, [poolId, walletAddress])

  const handleCheckin = async () => {
    if (!poolId || !pool) return

    try {
      const today = new Date().toISOString().split("T")[0]
      await poolCheckin(poolId, walletAddress, today)
      setCheckedInToday(true)
      const checkinDate = new Date(today)
      const startDate = new Date(pool.created_at.split("T")[0])
      const dayIndex = Math.floor(
        (checkinDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      )
      if (dayIndex >= 0 && dayIndex < pool.duration) {
        setDays((prev) => {
          const next = [...prev]
          next[dayIndex] = true
          return next
        })
      }
    } catch (error) {
      alert("Failed to check in: " + (error as Error).message)
    }
  }

  const handleJoin = async () => {
    if (!poolId) return

    try {
      await joinPool(poolId, walletAddress)
      setJoined(true)

      const [updatedPool, updatedParticipants, updatedCheckins] =
        await Promise.all([
          getPool(poolId),
          getPoolParticipants(poolId),
          getPoolCheckins(poolId, walletAddress),
        ])

      if (updatedPool) {
        setPool(updatedPool)
        const daysArray = Array.from(
          { length: updatedPool.duration },
          () => false,
        )
        updatedCheckins.forEach((checkin: any) => {
          const checkinDate = new Date(checkin.check_in_date)
          const startDate = new Date(updatedPool.created_at.split("T")[0])
          const dayIndex = Math.floor(
            (checkinDate.getTime() - startDate.getTime()) /
              (1000 * 60 * 60 * 24),
          )
          if (dayIndex >= 0 && dayIndex < daysArray.length) {
            daysArray[dayIndex] = true
          }
        })
        setDays(daysArray)
      }

      setParticipants(updatedParticipants)

      const today = new Date().toISOString().split("T")[0]
      setCheckedInToday(
        updatedCheckins.some((c: any) => c.check_in_date === today),
      )
    } catch (error) {
      alert("Failed to join pool: " + (error as Error).message)
    }
  }

  const completed = days.filter(Boolean).length
  const totalPot = pool
    ? parseFloat(pool.stake_amount) * (participants.length || 0)
    : 0
  const activeParticipants = participants.filter(
    (p) => p.status === "active",
  ).length
  const winnerShare =
    activeParticipants > 0
      ? Math.round(
          (totalPot * (pool?.winner_split || 60)) / 100 / activeParticipants,
        )
      : 0
  const todayStr = new Date().toISOString().split("T")[0]
  const currentDayIndex = pool
    ? Math.floor(
        (new Date(todayStr).getTime() -
          new Date(pool.created_at.split("T")[0]).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0

  if (loading) {
    return (
      <div
        style={{
          padding: "0 16px 32px",
          maxWidth: "600px",
          width: "100%",
          margin: "0 auto",
          textAlign: "center",
          paddingTop: "80px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: "var(--text-muted)",
          }}
        >
          Loading pool...
        </p>
      </div>
    )
  }

  if (!pool) {
    return (
      <div
        style={{
          padding: "0 16px 32px",
          maxWidth: "600px",
          width: "100%",
          margin: "0 auto",
          textAlign: "center",
          paddingTop: "80px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: "var(--text-muted)",
          }}
        >
          Pool not found
        </p>
        <button
          onClick={onBack}
          style={{
            marginTop: "16px",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "var(--gold)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Back to Pools
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "0 16px 32px",
        maxWidth: "600px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 500,
              color: "var(--text)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {pool.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "var(--text-muted)",
              margin: "6px 0 0",
              letterSpacing: "0.03em",
            }}
          >
            {pool.description}
          </p>
        </div>
        <StampBadge
          state={pool.status === "active" ? "staked" : "fulfilled"}
          size="md"
        />
      </div>

      {/* Pool info */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--rule)",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {pool.duration}-Day Challenge
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              color: "var(--gold)",
            }}
          >
            {completed}/{pool.duration}
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            flexWrap: "wrap",
            marginBottom: "14px",
          }}
        >
          {days.map((checked, i) => (
            <div
              key={i}
              title={`Day ${i + 1}: ${
                checked
                  ? "completed"
                  : i > currentDayIndex
                    ? "upcoming"
                    : "missed"
              }`}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                backgroundColor: checked ? "var(--gold)" : "var(--rule)",
                opacity: checked ? 1 : 0.6,
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                color: "var(--text-muted)",
                margin: "0 0 4px",
                letterSpacing: "0.04em",
              }}
            >
              TOTAL POT
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "18px",
                color: "var(--gold)",
                margin: 0,
              }}
            >
              {totalPot.toFixed(2)} {pool.currency}
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                color: "var(--text-muted)",
                margin: "0 0 4px",
                letterSpacing: "0.04em",
              }}
            >
              YOUR SHARE IF WIN
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "18px",
                color: "var(--green)",
                margin: 0,
              }}
            >
              {winnerShare.toFixed(2)} {pool.currency}
            </p>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--rule)",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "8px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            margin: "0 0 14px",
          }}
        >
          Participants ({participants.length}/{pool.max_participants})
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {participants.map((participant, i) => (
            <div
              key={participant.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom:
                  i < participants.length - 1
                    ? "1px solid var(--rule)"
                    : "none",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--rule)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "13px",
                      color: "var(--text)",
                      margin: 0,
                    }}
                  >
                    {participant.wallet_address}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      margin: "2px 0 0",
                    }}
                  >
                    {participant.days_completed}/{pool.duration} days
                  </p>
                </div>
              </div>
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background:
                    participant.status === "active"
                      ? "color-mix(in srgb, var(--green) 12%, var(--surface))"
                      : "color-mix(in srgb, var(--red) 12%, var(--surface))",
                  border: `1px solid ${
                    participant.status === "active"
                      ? "var(--green)"
                      : "var(--red)"
                  }`,
                  color:
                    participant.status === "active"
                      ? "var(--green)"
                      : "var(--red)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                }}
              >
                {participant.status === "active" ? "ON TRACK" : "BEHIND"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--rule)",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "14px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            margin: "0 0 12px",
          }}
        >
          Pool Rules
        </p>
        <ul
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "var(--text)",
            margin: 0,
            paddingLeft: "20px",
            lineHeight: 1.7,
          }}
        >
          <li style={{ marginBottom: "8px" }}>
            Each participant stakes {parseFloat(pool.stake_amount).toFixed(2)}{" "}
            {pool.currency}
          </li>
          <li style={{ marginBottom: "8px" }}>
            Complete all {pool.duration} days to be a winner
          </li>
          <li style={{ marginBottom: "8px" }}>
            Winners split {pool.winner_split}% of forfeited stakes
          </li>
          <li>Remaining {100 - pool.winner_split}% goes to charity</li>
        </ul>
      </div>

      {!joined ? (
        <button
          onClick={handleJoin}
          style={{
            width: "100%",
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            padding: "14px 20px",
            borderRadius: "10px",
            border: "1px solid var(--gold)",
            background: "var(--gold)",
            color: "var(--bg)",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          Join Pool ({parseFloat(pool.stake_amount).toFixed(2)} {pool.currency})
        </button>
      ) : (
        <CheckinButton
          checkedInToday={checkedInToday}
          onCheckin={handleCheckin}
        />
      )}
    </div>
  )
}
