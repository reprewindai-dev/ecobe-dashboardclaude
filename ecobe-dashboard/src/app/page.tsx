'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ecobeApi } from '@/lib/api'
import { CarbonIntensityCard } from '@/components/CarbonIntensityCard'
import { GreenRoutingForm } from '@/components/GreenRoutingForm'
import { EnergyCalculator } from '@/components/EnergyCalculator'
import { DekesStats } from '@/components/DekesStats'

const POPULAR_REGIONS = [
  { code: 'US-CAL-CISO', name: 'California' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
]

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'routing' | 'calculator' | 'dekes'>(
    'overview'
  )

  // Health check query
  const { data: health, isError: healthError } = useQuery({
    queryKey: ['health'],
    queryFn: () => ecobeApi.health(),
    refetchInterval: 30000, // Check every 30 seconds
  })

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <div
        className={`rounded-lg px-4 py-3 flex items-center justify-between ${
          healthError
            ? 'bg-red-500/10 border border-red-500/20'
            : 'bg-emerald-500/10 border border-emerald-500/20'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`h-3 w-3 rounded-full ${healthError ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}
          />
          <p className={`text-sm font-medium ${healthError ? 'text-red-400' : 'text-emerald-400'}`}>
            {healthError ? 'ECOBE Engine Offline' : 'ECOBE Engine Online'}
          </p>
        </div>
        {health && (
          <p className="text-xs text-slate-400">
            Last updated: {new Date(health.timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Carbon Monitoring Dashboard</h2>
        <p className="text-slate-400">
          Real-time carbon intensity monitoring and workload optimization
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-800">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'routing', label: 'Green Routing' },
            { id: 'calculator', label: 'Energy Calculator' },
            { id: 'dekes', label: 'DEKES Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-3 px-1 border-b-2 transition ${
                selectedTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Popular Regions - Current Carbon Intensity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {POPULAR_REGIONS.map((region) => (
                  <CarbonIntensityCard key={region.code} region={region} />
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">About ECOBE Engine</h3>
              <div className="space-y-3 text-slate-300">
                <p>
                  ECOBE Engine provides real-time carbon emissions monitoring and intelligent workload
                  routing to minimize your infrastructure's environmental impact.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-emerald-400 font-semibold text-2xl">🌍</p>
                    <p className="text-sm text-slate-400 mt-2">Real-time carbon data</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-emerald-400 font-semibold text-2xl">⚡</p>
                    <p className="text-sm text-slate-400 mt-2">Smart green routing</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-emerald-400 font-semibold text-2xl">📊</p>
                    <p className="text-sm text-slate-400 mt-2">ML-powered forecasting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'routing' && <GreenRoutingForm />}

        {selectedTab === 'calculator' && <EnergyCalculator />}

        {selectedTab === 'dekes' && <DekesStats />}
      </div>
    </div>
  )
}
