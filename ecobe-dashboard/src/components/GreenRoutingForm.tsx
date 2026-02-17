'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ecobeApi, type GreenRoutingRequest } from '@/lib/api'
import { getCarbonLevel, getCarbonColor } from '@/types'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

const REGIONS = [
  'US-CAL-CISO',
  'FR',
  'DE',
  'GB',
  'SE',
  'NO',
  'BR',
  'JP',
  'AU-NSW',
  'SG',
]

export function GreenRoutingForm() {
  const [formData, setFormData] = useState<GreenRoutingRequest>({
    preferredRegions: ['US-CAL-CISO', 'FR', 'DE'],
    maxCarbonGPerKwh: 400,
    carbonWeight: 0.5,
    latencyWeight: 0.3,
    costWeight: 0.2,
  })

  const mutation = useMutation({
    mutationFn: (data: GreenRoutingRequest) => ecobeApi.routeGreen(data),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const toggleRegion = (region: string) => {
    const current = formData.preferredRegions
    if (current.includes(region)) {
      setFormData({
        ...formData,
        preferredRegions: current.filter((r) => r !== region),
      })
    } else {
      setFormData({
        ...formData,
        preferredRegions: [...current, region],
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Green Routing Optimizer</h3>
        <p className="text-slate-400">
          Find the optimal region for your workload based on carbon, latency, and cost.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Region Selection */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">
                Select Regions ({formData.preferredRegions.length})
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => toggleRegion(region)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      formData.preferredRegions.includes(region)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Carbon Threshold */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Max Carbon Intensity (gCO₂/kWh)
              </label>
              <input
                type="number"
                value={formData.maxCarbonGPerKwh || ''}
                onChange={(e) =>
                  setFormData({ ...formData, maxCarbonGPerKwh: Number(e.target.value) })
                }
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="400"
              />
            </div>

            {/* Weight Sliders */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-300">Optimization Weights</p>

              <div>
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Carbon Priority</span>
                  <span>{(formData.carbonWeight! * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.carbonWeight}
                  onChange={(e) =>
                    setFormData({ ...formData, carbonWeight: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Latency Priority</span>
                  <span>{(formData.latencyWeight! * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.latencyWeight}
                  onChange={(e) =>
                    setFormData({ ...formData, latencyWeight: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Cost Priority</span>
                  <span>{(formData.costWeight! * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.costWeight}
                  onChange={(e) =>
                    setFormData({ ...formData, costWeight: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending || formData.preferredRegions.length === 0}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <span>Find Optimal Region</span>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Routing Result</h4>

          {mutation.isPending && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          )}

          {mutation.isError && (
            <div className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">Optimization Failed</p>
                <p className="text-sm text-red-300/70 mt-1">
                  {mutation.error instanceof Error ? mutation.error.message : 'Unknown error'}
                </p>
              </div>
            </div>
          )}

          {mutation.isSuccess && mutation.data && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-400">Optimal Region Found</p>
                  <p className="text-2xl font-bold text-white mt-2">
                    {mutation.data.selectedRegion}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Carbon Intensity</p>
                  <p
                    className={`text-lg font-semibold ${getCarbonColor(getCarbonLevel(mutation.data.carbonIntensity))}`}
                  >
                    {mutation.data.carbonIntensity} gCO₂/kWh
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Optimization Score</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    {(mutation.data.score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {mutation.data.alternatives && mutation.data.alternatives.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-3">Alternatives</p>
                  <div className="space-y-2">
                    {mutation.data.alternatives.slice(0, 3).map((alt) => (
                      <div
                        key={alt.region}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                      >
                        <span className="text-sm text-slate-300">{alt.region}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-slate-400">
                            {alt.carbonIntensity} gCO₂/kWh
                          </span>
                          <span className="text-sm text-slate-500">
                            {(alt.score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!mutation.isPending && !mutation.isError && !mutation.isSuccess && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <p className="text-sm">Configure parameters and click optimize</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
