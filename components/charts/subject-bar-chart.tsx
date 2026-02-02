"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Cell,
    Tooltip,
} from "recharts"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { BarChartData } from "@/lib/data/types"

interface SubjectBarChartProps {
    data: (BarChartData & { min?: number; max?: number; median?: number })[]
    className?: string
    showLegend?: boolean
}

const chartConfig = {
    value: {
        label: "Average %",
    },
    pome: {
        label: "POME",
        color: "oklch(0.7 0.15 280)",
    },
    dbms: {
        label: "DBMS",
        color: "oklch(0.65 0.18 200)",
    },
    aiml: {
        label: "AIML",
        color: "oklch(0.7 0.2 145)",
    },
    toc: {
        label: "TOC",
        color: "oklch(0.75 0.18 45)",
    },
    elective: {
        label: "Elective",
        color: "oklch(0.65 0.22 320)",
    },
} satisfies ChartConfig

interface TooltipPayload {
    payload: BarChartData & { min?: number; max?: number; median?: number }
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
    if (!active || !payload || payload.length === 0) return null

    const data = payload[0].payload

    return (
        <div className="rounded-lg border bg-background p-3 shadow-md min-w-[140px]">
            <p className="font-medium text-sm mb-2">{data.name}</p>
            <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Average:</span>
                    <span className="font-mono font-semibold">{data.value}%</span>
                </div>
                {data.median !== undefined && (
                    <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Median:</span>
                        <span className="font-mono">{data.median}%</span>
                    </div>
                )}
                {data.min !== undefined && (
                    <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Min:</span>
                        <span className="font-mono">{data.min}%</span>
                    </div>
                )}
                {data.max !== undefined && (
                    <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Max:</span>
                        <span className="font-mono">{data.max}%</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export function SubjectBarChart({
    data,
    className,
    showLegend = false,
}: SubjectBarChartProps) {
    return (
        <ChartContainer config={chartConfig} className={className}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                accessibilityLayer
            >
                <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-border/30"
                />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-xs"
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => `${value}%`}
                    className="text-xs"
                    domain={[0, 100]}
                />
                <Tooltip
                    cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
                    content={<CustomTooltip />}
                />
                <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    className="transition-all duration-200"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.fill || "var(--color-primary)"}
                            className="hover:opacity-80 transition-opacity"
                        />
                    ))}
                </Bar>
                {showLegend && (
                    <ChartLegend content={<ChartLegendContent />} />
                )}
            </BarChart>
        </ChartContainer>
    )
}

