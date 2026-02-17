import axios from 'axios'
import type {
  EnergyEquationResult,
  GreenRoutingResult,
  DekesAnalytics,
  CarbonForecast,
} from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_ECOBE_API_URL || '/api/ecobe'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface EnergyEquationRequest {
  requestVolume: number
  workloadType: 'inference' | 'training' | 'batch'
  modelSize?: string
  regionTargets: string[]
  carbonBudget?: number
  deadlineWindow?: {
    start: string
    end: string
  }
  hardwareMix?: {
    cpu: number
    gpu: number
    tpu: number
  }
}

export interface GreenRoutingRequest {
  preferredRegions: string[]
  maxCarbonGPerKwh?: number
  latencyMsByRegion?: Record<string, number>
  carbonWeight?: number
  latencyWeight?: number
  costWeight?: number
}

export interface DekesOptimizeRequest {
  query: {
    id: string
    query: string
    estimatedResults: number
  }
  carbonBudget: number
  regions: string[]
}

export interface DekesScheduleRequest {
  queries: Array<{
    id: string
    query: string
    estimatedResults: number
  }>
  regions: string[]
  lookAheadHours?: number
}

export const ecobeApi = {
  // Energy Equation
  async calculateEnergyEquation(request: EnergyEquationRequest): Promise<EnergyEquationResult> {
    const { data } = await api.post('/energy/equation', request)
    return data
  },

  // Green Routing
  async routeGreen(request: GreenRoutingRequest): Promise<GreenRoutingResult> {
    const { data } = await api.post('/route/green', request)
    return data
  },

  // DEKES Integration
  async optimizeDekesQuery(request: DekesOptimizeRequest) {
    const { data } = await api.post('/dekes/optimize', request)
    return data
  },

  async scheduleDekesQueries(request: DekesScheduleRequest) {
    const { data } = await api.post('/dekes/schedule', request)
    return data
  },

  async getDekesAnalytics(params?: {
    dekesQueryId?: string
    startDate?: string
    endDate?: string
  }): Promise<DekesAnalytics> {
    const { data } = await api.get('/dekes/analytics', { params })
    return data
  },

  // Health Check
  async health() {
    const { data } = await api.get('/health')
    return data
  },
}

export default api
