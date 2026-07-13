# StakeHabit Web

A habit tracker where users lock XLM/USDC against a goal. Hitting the target streak returns the stake; missing it redirects the stake to a charity pool or community pot.

## Features

- **Personal Habit Staking**: Lock crypto against personal habit goals with charity fallback
- **Peer-to-Peer Staking Pools**: Compete with others in challenge pools where winners share forfeited stakes
- **Daily Check-ins**: Track habit completion with visual streak tracking
- **Real-time Pool Data**: Live participant leaderboards and pool statistics
- **JWT Authentication**: Secure user authentication with email/password

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **API**: REST API with JWT authentication
- **Blockchain**: Stellar/Soroban integration (via backend)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update API URL in .env if needed
# Default: https://stakehabit-api.onrender.com
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

```env
VITE_API_URL=https://stakehabit-api.onrender.com
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── CharityPicker.tsx
│   ├── CheckinButton.tsx
│   ├── HabitCard.tsx
│   ├── StakeAmountSlider.tsx
│   ├── StampBadge.tsx
│   ├── StreakHeatmap.tsx
│   └── WalletConnectButton.tsx
├── screens/          # Page-level components
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── HabitDetail.tsx
│   ├── NewHabit.tsx
│   ├── StakeDetail.tsx
│   ├── PoolList.tsx
│   ├── PoolDetail.tsx
│   └── CreatePool.tsx
├── lib/              # Utilities and API client
│   ├── api.ts
│   └── poolStorage.ts
├── App.tsx           # Main application component
├── main.tsx          # React entry point
└── index.css         # Global styles
```

## API Integration

The frontend connects to the StakeHabit API for:

- Authentication (login/register)
- Pool management (create, list, join, check-in)
- Habit tracking
- Participant data

See `src/lib/api.ts` for API client implementation.

## Staking Pool Flow

1. **Browse Pools**: View available challenge pools with participant counts and pot sizes
2. **Create Pool**: Set up a new pool with custom rules (duration, stake amount, winner split, charity)
3. **Join Pool**: Stake your crypto to join an existing pool
4. **Daily Check-ins**: Complete your habit daily to maintain your streak
5. **Win/Lose**: At pool end, winners split forfeited stakes; losers' stakes go to charity

## License

MIT
