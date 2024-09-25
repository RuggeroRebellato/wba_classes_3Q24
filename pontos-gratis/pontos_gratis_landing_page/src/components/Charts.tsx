import React, { useState, useMemo, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

interface VaultData {
  week: number
  totalVault: number
  weeklyFees: number
  totalFeesCollected: number
  vaultToTotalRaisedRatio: number
  feesToTotalRaisedRatio: number
}

interface PerformanceData {
  period: string
  totalVault: number
  totalFeesCollected: number
  vaultToTotalRaisedRatio: number
  feesToTotalRaisedRatio: number
}

interface InputFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
}

interface Inputs {
  totalRaised: number
  initialWeeklyFee: number
  repaymentPercentage: number
  growthRateYear1: number
  growthRateYear2: number
  growthRateYear3: number
}

const InputField: React.FC<InputFieldProps> = React.memo(
  ({ label, value, onChange, step = 1, min = 0, max }) => {
    const [localValue, setLocalValue] = useState(value.toString())

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setLocalValue(newValue)

        const numValue = parseFloat(newValue)
        if (!isNaN(numValue)) {
          onChange(numValue)
        }
      },
      [onChange]
    )

    const handleBlur = useCallback(() => {
      const numValue = parseFloat(localValue)
      if (isNaN(numValue)) {
        setLocalValue(value.toString())
      } else {
        setLocalValue(numValue.toString())
        onChange(numValue)
      }
    }, [localValue, onChange, value])

    return (
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-300">
          {label}
        </label>
        <input
          type="number"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          step={step}
          min={min}
          max={max}
          className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-gray-300 shadow-sm focus:border-[#EEB85D] focus:outline-none focus:ring-[#EEB85D]"
        />
      </div>
    )
  }
)

InputField.displayName = 'InputField'

const PontosVaultAnalytics: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    totalRaised: 1500000,
    initialWeeklyFee: 1000,
    repaymentPercentage: 50,
    growthRateYear1: 5,
    growthRateYear2: 3,
    growthRateYear3: 1.5
  })

  const handleInputChange = useCallback((key: keyof Inputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }, [])

  const WEEKS_PER_YEAR = 52
  const INVESTMENT_PERIOD_WEEKS = WEEKS_PER_YEAR * 3 // 3 years

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const calculateVaultGrowth = useMemo<VaultData[]>(() => {
    let totalVault = 0
    let weeklyFees = inputs.initialWeeklyFee
    let totalFeesCollected = 0

    return Array.from({ length: INVESTMENT_PERIOD_WEEKS + 1 }, (_, week) => {
      const yearIndex = Math.floor(week / WEEKS_PER_YEAR)
      const growthRate =
        [
          inputs.growthRateYear1,
          inputs.growthRateYear2,
          inputs.growthRateYear3
        ][yearIndex] || inputs.growthRateYear3

      if (week > 0) {
        weeklyFees *= 1 + growthRate / 100
      }

      totalFeesCollected += weeklyFees
      totalVault += weeklyFees * (inputs.repaymentPercentage / 100)

      const safeTotalRaised = inputs.totalRaised || 1

      return {
        week,
        totalVault: isNaN(totalVault) ? 0 : totalVault,
        weeklyFees: isNaN(weeklyFees) ? 0 : weeklyFees,
        totalFeesCollected: isNaN(totalFeesCollected) ? 0 : totalFeesCollected,
        vaultToTotalRaisedRatio: totalVault / safeTotalRaised,
        feesToTotalRaisedRatio: totalFeesCollected / safeTotalRaised
      }
    })
  }, [inputs, INVESTMENT_PERIOD_WEEKS])

  const vaultPerformance = useMemo<PerformanceData[]>(() => {
    const periods = [26, 52, 78, 104, 130, 156] // Every 6 months
    return periods.map((week) => {
      const data = calculateVaultGrowth[week] || {
        totalVault: 0,
        totalFeesCollected: 0,
        vaultToTotalRaisedRatio: 0,
        feesToTotalRaisedRatio: 0
      }
      return {
        period: `${(week / 26) * 6} months`,
        totalVault: isNaN(data.totalVault) ? 0 : data.totalVault,
        totalFeesCollected: isNaN(data.totalFeesCollected)
          ? 0
          : data.totalFeesCollected,
        vaultToTotalRaisedRatio: isNaN(data.vaultToTotalRaisedRatio)
          ? 0
          : data.vaultToTotalRaisedRatio,
        feesToTotalRaisedRatio: isNaN(data.feesToTotalRaisedRatio)
          ? 0
          : data.feesToTotalRaisedRatio
      }
    })
  }, [calculateVaultGrowth])

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <Helmet>
        <title>Pontos Vault Analytics Dashboard</title>
        <meta
          name="description"
          content="Analyze the performance of Pontos Vault over time."
        />
        <meta property="og:title" content="Pontos Vault Analytics Dashboard" />
        <meta
          property="og:description"
          content="Analyze the performance of Pontos Vault over time."
        />
        <meta property="og:image" content="URL_TO_IMAGE" />
        <meta property="og:url" content="URL_TO_PAGE" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pontos Vault Analytics Dashboard" />
        <meta
          name="twitter:description"
          content="Analyze the performance of Pontos Vault over time."
        />
        <meta name="twitter:image" content="URL_TO_IMAGE" />
      </Helmet>

      <div className="mx-auto max-w-7xl rounded-lg bg-gray-800 p-6 text-gray-300 shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-[#EEB85D]">
          Pontos.Vault Analytics Dashboard
        </h2>
        <p className="mb-8 text-lg">
          Startups going through Y Combinator often aim for 5-7% growth per week
          in the first year, with the most successful startups achieving 10%
          weekly growth.
        </p>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InputField
            label="Total Raised in Vault (USDC)"
            value={inputs.totalRaised}
            onChange={(value) => handleInputChange('totalRaised', value)}
            step={1000}
          />
          <InputField
            label="Initial Weekly Fee (USDC)"
            value={inputs.initialWeeklyFee}
            onChange={(value) => handleInputChange('initialWeeklyFee', value)}
          />
          <InputField
            label="% of Fees for Investor Repayment"
            value={inputs.repaymentPercentage}
            onChange={(value) =>
              handleInputChange('repaymentPercentage', value)
            }
            min={0}
            max={100}
            step={1}
          />
          <InputField
            label="Weekly Growth Rate Year 1 (%)"
            value={inputs.growthRateYear1}
            onChange={(value) => handleInputChange('growthRateYear1', value)}
            step={0.01}
          />
          <InputField
            label="Weekly Growth Rate Year 2 (%)"
            value={inputs.growthRateYear2}
            onChange={(value) => handleInputChange('growthRateYear2', value)}
            step={0.01}
          />
          <InputField
            label="Weekly Growth Rate Year 3 (%)"
            value={inputs.growthRateYear3}
            onChange={(value) => handleInputChange('growthRateYear3', value)}
            step={0.01}
          />
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold text-[#EEB85D]">
            Vault and Fees Growth Over Time
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={calculateVaultGrowth.filter((_, index) => index % 4 === 0)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis
                dataKey="week"
                label={{
                  value: 'Weeks',
                  position: 'insideBottom',
                  offset: -5,
                  fill: '#9CA3AF'
                }}
                stroke="#9CA3AF"
              />
              <YAxis
                label={{
                  value: 'USDC',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#9CA3AF'
                }}
                tickFormatter={(value) => formatCurrency(value)}
                stroke="#9CA3AF"
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'USDC']}
                labelFormatter={(label: string) => `Week ${label}`}
                contentStyle={{ backgroundColor: '#374151', border: 'none' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalVault"
                stroke="#EEB85D"
                name="Total Vault"
              />
              <Line
                type="monotone"
                dataKey="totalFeesCollected"
                stroke="#10B981"
                name="Total Fees Collected"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-2xl font-semibold text-[#EEB85D]">
            Vault Performance Ratios
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={vaultPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="period" stroke="#9CA3AF" />
              <YAxis
                tickFormatter={(value) => formatPercentage(value)}
                stroke="#9CA3AF"
              />
              <Tooltip
                formatter={(value: number) => [
                  formatPercentage(value),
                  'Ratio'
                ]}
                labelFormatter={(label: string) => `Period: ${label}`}
                contentStyle={{ backgroundColor: '#374151', border: 'none' }}
              />
              <Legend />
              <Bar
                dataKey="vaultToTotalRaisedRatio"
                fill="#EEB85D"
                name="Vault to Total Raised Ratio"
              />
              <Bar
                dataKey="feesToTotalRaisedRatio"
                fill="#10B981"
                name="Fees to Total Raised Ratio"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="mb-4 text-2xl font-semibold text-[#EEB85D]">
            Vault Performance Metrics
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Total Vault (USDC)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Total Fees Collected (USDC)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Vault to Total Raised Ratio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Fees to Total Raised Ratio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-900">
                {vaultPerformance.map((data, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-300">
                      {data.period}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                      {formatCurrency(data.totalVault)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                      {formatCurrency(data.totalFeesCollected)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                      {formatPercentage(data.vaultToTotalRaisedRatio)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                      {formatPercentage(data.feesToTotalRaisedRatio)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PontosVaultAnalytics
