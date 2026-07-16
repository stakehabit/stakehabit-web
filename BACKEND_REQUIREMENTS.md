# Backend Requirements for Multi-User Pool Support

## Current State
The app currently uses `localStorage` for pool persistence. This works for demo/testing on a single device but **does not support multi-user functionality**. Each user's browser has its own isolated localStorage.

## Required Backend Components

### 1. Database
You'll need a database to store pools, participants, and check-ins. Options:

**PostgreSQL (Recommended)**
- Tables needed:
  - `pools` - Pool metadata (id, title, description, duration, stake_amount, currency, max_participants, winner_split, charity, status, created_at, creator_address)
  - `pool_participants` - Participant tracking (id, pool_id, wallet_address, joined_at, days_completed, current_streak, status)
  - `pool_checkins` - Daily check-ins (id, participant_id, pool_id, check_in_date, tx_hash)

**Supabase** (PostgreSQL + Auth + Realtime)
- Quick setup, built-in auth, real-time subscriptions
- Good for MVP

**MongoDB**
- Flexible schema, good for rapid prototyping

### 2. API Layer
REST or GraphQL API to handle:

**Pool Operations**
- `GET /pools` - List all active pools
- `GET /pools/:id` - Get pool details with participants
- `POST /pools` - Create new pool
- `POST /pools/:id/join` - Join a pool (requires wallet signature)
- `GET /pools/:id/participants` - Get participant leaderboard

**Check-in Operations**
- `POST /pools/:id/checkin` - Submit daily check-in
- `GET /pools/:id/checkins/:address` - Get user's check-in history

**Wallet Integration**
- Verify wallet signatures for authentication
- Interact with Soroban smart contracts for actual stake locking

### 3. Smart Contract (Soroban)
For actual stake management on Stellar:

```rust
// Contract functions needed:
- create_pool(pool_id, amount, duration, rules)
- join_pool(pool_id, participant)
- check_in(pool_id, participant)
- distribute_rewards(pool_id) - Called at pool end
- emergency_withdraw(pool_id, participant)
```

### 4. Authentication
- Wallet-based auth using Stellar wallet signatures
- JWT tokens issued after signature verification
- Middleware to protect API endpoints

### 5. Real-time Updates (Optional but Recommended)
- WebSocket server or Supabase Realtime
- Push pool updates to all connected clients
- Live participant count, check-in notifications

## Recommended Tech Stack

**Option 1: Quick MVP (Supabase)**
- Supabase (PostgreSQL + Auth + Realtime)
- Next.js API routes
- Soroban contract for stake management

**Option 2: Production-Ready**
- Node.js + Express or Fastify
- PostgreSQL with Prisma ORM
- Stellar SDK for Soroban interaction
- Redis for caching
- WebSocket server for real-time updates

## Migration Path

1. **Phase 1 (Current)**: localStorage for single-user demo
2. **Phase 2**: Add simple backend API + database
3. **Phase 3**: Integrate Soroban smart contracts
4. **Phase 4**: Add real-time updates and advanced features

## Data Model Example

```sql
CREATE TABLE pools (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  stake_amount DECIMAL(20, 7) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  max_participants INTEGER NOT NULL,
  winner_split INTEGER NOT NULL,
  charity VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  contract_address VARCHAR(56),
  created_at TIMESTAMP DEFAULT NOW(),
  creator_address VARCHAR(56) NOT NULL
);

CREATE TABLE pool_participants (
  id SERIAL PRIMARY KEY,
  pool_id INTEGER REFERENCES pools(id),
  wallet_address VARCHAR(56) NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  days_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  UNIQUE(pool_id, wallet_address)
);

CREATE TABLE pool_checkins (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES pool_participants(id),
  pool_id INTEGER REFERENCES pools(id),
  check_in_date DATE NOT NULL,
  tx_hash VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(participant_id, check_in_date)
);
```
