"use client"

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    ZAxis,
    Tooltip,
} from "recharts"
import {
    ChartContainer,
    type ChartConfig,
} from "@/components/ui/chart"
import { ScatterPoint } from "@/lib/data/types"

interface CorrelationScatterChartProps {
    data: ScatterPoint[]
    xLabel: string
    yLabel: string
    className?: string
}

const chartConfig = {
    student: {
        label: "Student",
        color: "oklch(0.65 0.18 200)",
    },
} satisfies ChartConfig

function CustomTooltip({ active, payload, xLabel, yLabel }: {
    active?: boolean
    payload?: { payload: ScatterPoint }[]
    xLabel: string
    yLabel: string
}) {
    if (!active || !payload || payload.length === 0) return null

    const point = payload[0].payload

    return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
            <p className="font-medium text-sm">{point.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{point.usn}</p>
            <div className="mt-2 space-y-1 text-xs">
                <p><span className="text-muted-foreground">{xLabel}:</span> <span className="font-mono font-medium">{point.x.toFixed(1)}%</span></p>
                <p><span className="text-muted-foreground">{yLabel}:</span> <span className="font-mono font-medium">{point.y.toFixed(1)}%</span></p>
            </div>
        </div>
    )
}

export function CorrelationScatterChart({
    data,
    xLabel,
    yLabel,
    className,
}: CorrelationScatterChartProps) {
    return (
        <ChartContainer config={chartConfig} className={className}>
            <ScatterChart
                margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                accessibilityLayer
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/30"
                />
                <XAxis
                    type="number"
                    dataKey="x"
                    name={xLabel}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-xs"
                    domain={[0, 100]}
                    label={{
                        value: xLabel,
                        position: "bottom",
                        offset: 20,
                        className: "text-xs fill-muted-foreground",
                    }}
                />
                <YAxis
                    type="number"
                    dataKey="y"
                    name={yLabel}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-xs"
                    domain={[0, 100]}
                    label={{
                        value: yLabel,
                        angle: -90,
                        position: "left",
                        offset: 20,
                        className: "text-xs fill-muted-foreground",
                    }}
                />
                <ZAxis range={[40, 80]} />
                <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={<CustomTooltip xLabel={xLabel} yLabel={yLabel} />}
                />
                <Scatter
                    name="Students"
                    data={data}
                    fill="oklch(0.65 0.18 200)"
                    fillOpacity={0.6}
                    className="transition-all duration-200"
                />
            </ScatterChart>
        </ChartContainer>
    )
}
