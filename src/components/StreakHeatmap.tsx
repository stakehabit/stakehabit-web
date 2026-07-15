interface StreakHeatmapProps {
  days: boolean[]
  completed?: boolean
}

export default function StreakHeatmap({
  days,
  completed = false,
}: StreakHeatmapProps) {
  const fillColor = completed ? "var(--green)" : "var(--gold)"

  return (
    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
      {days.map((checked, i) => (
        <div
          key={i}
          title={`Day ${i + 1}: ${checked ? "completed" : "missed"}`}
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "2px",
            backgroundColor: checked ? fillColor : "var(--rule)",
            opacity: checked ? 1 : 0.6,
            transition: "background-color 0.2s",
          }}
        />
      ))}
    </div>
  )
}
