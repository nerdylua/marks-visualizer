"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
    ErrorBar,
    ReferenceLine,
} from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart"
import { ELECTIVE_COLORS } from "@/lib/data/constants"

interface ElectiveScoreData {
    elective: string
    min: number
    max: number
    mean: number
    median: number
    q1: number
    q3: number
}

interface ElectiveScoreDistributionChartProps {
    data: ElectiveScoreData[]
    className?: string
}

const chartConfig = {
    mean: {
        label: "Mean",
        color: "oklch(0.65 0.18 200)",
    },
} satisfies ChartConfig

function CustomTooltip({ active, payload }: {
    active?: boolean
    payload?: { payload: ElectiveScoreData }[]
}) {
    if (!active || !payload || payload.length === 0) return null

    const data = payload[0].payload

    return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
            <p className="font-medium text-sm mb-2">{data.elective}</p>
            <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Max:</span>
                    <span className="font-mono font-medium">{data.max}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Q3 (75%):</span>
                    <span className="font-mono font-medium">{data.q3.toFixed(1)}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Mean:</span>
                    <span className="font-mono font-semibold">{data.mean.toFixed(1)}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Median:</span>
                    <span className="font-mono font-medium">{data.median.toFixed(1)}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Q1 (25%):</span>
                    <span className="font-mono font-medium">{data.q1.toFixed(1)}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Min:</span>
                    <span className="font-mono font-medium">{data.min}</span>
                </div>
            </div>
        </div>
    )
}

export function ElectiveScoreDistributionChart({
    data,
    className,
}: ElectiveScoreDistributionChartProps) {
    const chartData = data.map(d => ({
        ...d,
        range: d.max - d.min,
        errorLow: d.mean - d.min,
        errorHigh: d.max - d.mean,
    }))

    return (
        <ChartContainer config={chartConfig} className={className}>
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, bottom: 20, left: 100 }}
                accessibilityLayer
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/30"
                    horizontal={true}
                    vertical={false}
                />
                <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                />
                <YAxis
                    type="category"
                    dataKey="elective"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                    width={90}
                />
                <ChartTooltip
                    cursor={{ fill: 'transparent' }}
                    content={<CustomTooltip />}
                />
                <Bar
                    dataKey="mean"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={40}
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={ELECTIVE_COLORS[entry.elective as keyof typeof ELECTIVE_COLORS] || 'oklch(0.65 0.18 200)'}
                            fillOpacity={0.8}
                        />
                    ))}
                    <ErrorBar
                        dataKey="errorHigh"
                        direction="x"
                        width={8}
                        strokeWidth={2}
                        stroke="currentColor"
                        className="text-foreground/50"
                    />
                </Bar>
                {chartData.map((entry, index) => (
                    <ReferenceLine
                        key={`min-${index}`}
                        x={entry.min}
                        stroke="currentColor"
                        strokeDasharray="3 3"
                        className="text-muted-foreground/30"
                        segment={[
                            { x: entry.min, y: entry.elective },
                            { x: entry.min, y: entry.elective }
                        ]}
                    />
                ))}
            </BarChart>
        </ChartContainer>
    )
}
