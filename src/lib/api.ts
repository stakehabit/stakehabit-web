const API_BASE_URL = import.meta.env.VITE_API_URL || "https://stakehabit-api.onrender.com"

interface AuthResponse {
  access_token: string
  token_type: string
}

class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T,>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...Object.fromEntries(
        options.headers ? new Headers(options.headers).entries() : [],
      ),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.setToken(null)
        throw new Error("Unauthorized - Please login again")
      }
      const error = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }))
      throw new Error(error.detail || "Request failed")
    }

    return response.json()
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async getMe() {
    return this.request("/me")
  }

  // Pools
  async getPools() {
    return this.request("/pools")
  }

  async getPool(poolId: string) {
    return this.request(`/pools/${poolId}`)
  }

  async createPool(data: CreatePoolRequest) {
    return this.request("/pools", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async joinPool(poolId: string, walletAddress: string) {
    return this.request(`/pools/${poolId}/join`, {
      method: "POST",
      body: JSON.stringify({ wallet_address: walletAddress }),
    })
  }

  async getPoolParticipants(poolId: string) {
    return this.request(`/pools/${poolId}/participants`)
  }

  async poolCheckin(
    poolId: string,
    walletAddress: string,
    checkInDate: string,
  ) {
    return this.request(`/pools/${poolId}/checkin`, {
      method: "POST",
      body: JSON.stringify({
        wallet_address: walletAddress,
        check_in_date: checkInDate,
      }),
    })
  }

  async getPoolCheckins(poolId: string, walletAddress: string) {
    return this.request(`/pools/${poolId}/checkins/${walletAddress}`)
  }

  // Habits
  async getHabits() {
    return this.request("/habits")
  }

  async createHabit(data: any) {
    return this.request("/habits", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async habitCheckin(habitId: string) {
    return this.request(`/habits/${habitId}/checkins`, {
      method: "POST",
    })
  }
}

interface CreatePoolRequest {
  title: string
  description: string
  duration: number
  stake_amount: string
  currency: string
  max_participants: number
  winner_split: number
  charity: string
  creator_address: string
  status?: string
}

export const api = new ApiClient()
