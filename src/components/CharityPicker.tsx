interface Charity {
  id: string
  name: string
  description: string
  category: string
}

const CHARITIES: Charity[] = [
  {
    id: "givewell",
    name: "GiveWell Top Charities",
    description:
      "Evidence-based giving to high-impact global health interventions",
    category: "Global Health",
  },
  {
    id: "ef",
    name: "Evidence Action",
    description:
      "Scaling proven interventions: deworming programs & vitamin A supplements",
    category: "Global Health",
  },
  {
    id: "gd",
    name: "GiveDirectly",
    description:
      "Direct cash transfers to people living in extreme poverty in East Africa",
    category: "Economic Empowerment",
  },
  {
    id: "clean",
    name: "Clean Air Task Force",
    description:
      "Reducing catastrophic climate risk through technology and policy",
    category: "Climate",
  },
  {
    id: "sea",
    name: "Sea Shepherd",
    description: "Ocean conservation through direct action and education",
    category: "Environment",
  },
  {
    id: "acl",
    name: "ACLU Foundation",
    description:
      "Defending the Bill of Rights and the nation's liberties in court",
    category: "Civil Rights",
  },
]

interface CharityPickerProps {
  selected: string | null
  onSelect: (id: string) => void
}

export default function CharityPicker({
  selected,
  onSelect,
}: CharityPickerProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {CHARITIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            textAlign: "left",
            width: "100%",
            background:
              selected === c.id
                ? "color-mix(in srgb, var(--gold) 8%, var(--surface))"
                : "var(--surface)",
            border: `1px solid ${
              selected === c.id ? "var(--gold)" : "var(--rule)"
            }`,
            borderRadius: "8px",
            padding: "12px 14px",
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: `1.5px solid ${
                selected === c.id ? "var(--gold)" : "var(--rule)"
              }`,
              background: selected === c.id ? "var(--gold)" : "transparent",
              flexShrink: 0,
              marginTop: "2px",
              transition: "all 0.15s",
            }}
          />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text)",
                }}
              >
                {c.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  border: "1px solid var(--rule)",
                  borderRadius: "999px",
                  padding: "1px 8px",
                  letterSpacing: "0.05em",
                }}
              >
                {c.category}
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                color: "var(--text-muted)",
                margin: "4px 0 0",
                lineHeight: 1.5,
              }}
            >
              {c.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
