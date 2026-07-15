import { api } from './api'

export interface Pool {
  id: number
  title: string
  description: string
  duration: number
  stake_amount: string
  currency: string
  max_participants: number
  winner_split: number
  charity: string
  status: string
  created_at: string
  creator_address: string
  // Computed fields for UI
  currentParticipants?: number
  days?: boolean[]
}

export interface Participant {
  id: number
  pool_id: number
  wallet_address: string
  joined_at: string
  days_completed: number
  current_streak: number
  status: string
}

export async function getPools(): Promise<Pool[]> {
  try {
    const pools = await api.getPools() as any[]
    const poolsWithCounts = await Promise.all(
      pools.map(async (pool: any) => {
        try {
          const participants = await api.getPoolParticipants(pool.id.toString()) as any[]
          return {
            ...pool,
            currentParticipants: participants.length,
            days: Array.from({ length: pool.duration }, () => false),
          }
        } catch {
          return {
            ...pool,
            currentParticipants: pool.participant_count || 0,
            days: Array.from({ length: pool.duration }, () => false),
          }
        }
      })
    )
    return poolsWithCounts
  } catch (error) {
    console.error('Failed to fetch pools:', error)
    return []
  }
}

export async function getPool(id: number): Promise<Pool | undefined> {
  try {
    const pool = await api.getPool(id.toString())
    return {
      ...pool,
      currentParticipants: pool.participant_count || 0,
      days: Array.from({ length: pool.duration }, () => false),
    }
  } catch (error) {
    console.error('Failed to fetch pool:', error)
    return undefined
  }
}

export async function savePool(pool: Omit<Pool, 'id' | 'created_at'>): Promise<Pool> {
  try {
    const created = await api.createPool({
      title: pool.title,
      description: pool.description,
      duration: pool.duration,
      stake_amount: pool.stake_amount,
      currency: pool.currency,
      max_participants: pool.max_participants,
      winner_split: pool.winner_split,
      charity: pool.charity,
      creator_address: pool.creator_address,
    })
    return {
      ...created,
      currentParticipants: 1,
      days: Array.from({ length: pool.duration }, () => false),
    }
  } catch (error) {
    console.error('Failed to create pool:', error)
    throw error
  }
}

export async function joinPool(poolId: number, walletAddress: string): Promise<void> {
  try {
    await api.joinPool(poolId.toString(), walletAddress)
  } catch (error) {
    console.error('Failed to join pool:', error)
    throw error
  }
}

export async function getPoolParticipants(poolId: number): Promise<Participant[]> {
  try {
    return await api.getPoolParticipants(poolId.toString())
  } catch (error) {
    console.error('Failed to fetch participants:', error)
    return []
  }
}

export async function poolCheckin(poolId: number, walletAddress: string, checkInDate: string): Promise<void> {
  try {
    await api.poolCheckin(poolId.toString(), walletAddress, checkInDate)
  } catch (error) {
    console.error('Failed to check in:', error)
    throw error
  }
}

export async function getPoolCheckins(poolId: number, walletAddress: string): Promise<any[]> {
  try {
    return await api.getPoolCheckins(poolId.toString(), walletAddress)
  } catch (error) {
    console.error('Failed to fetch check-ins:', error)
    return []
  }
}
