"use client"

import { Pie, PieChart, Cell, Label } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { BarChartData } from "@/lib/data/types"
import { useMemo } from "react"

interface GradePieChartProps {
    data: BarChartData[]
    className?: string
    showLegend?: boolean
    innerLabel?: string
    innerValue?: string | number
}

const chartConfig = {
    count: {
        label: "Students",
    },
    O: {
        label: "Outstanding",
        color: "oklch(0.7 0.2 145)",
    },
    "A+": {
        label: "A+",
        color: "oklch(0.65 0.18 180)",
    },
    A: {
        label: "A",
        color: "oklch(0.65 0.18 200)",
    },
    "B+": {
        label: "B+",
        color: "oklch(0.7 0.15 250)",
    },
    B: {
        label: "B",
        color: "oklch(0.75 0.18 45)",
    },
    C: {
        label: "C",
        color: "oklch(0.7 0.2 60)",
    },
    F: {
        label: "Fail",
        color: "oklch(0.65 0.2 25)",
    },
} satisfies ChartConfig

export function GradePieChart({
    data,
    className,
    showLegend = true,
    innerLabel,
    innerValue,
}: GradePieChartProps) {
    const total = useMemo(
        () => data.reduce((sum, item) => sum + item.value, 0),
        [data]
    )

    const filteredData = data.filter(item => item.value > 0)

    return (
        <ChartContainer config={chartConfig} className={className}>
            <PieChart>
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={(value, name) => [
                                `${value} students (${((value as number / total) * 100).toFixed(1)}%)`,
                                name,
                            ]}
                        />
                    }
                />
                <Pie
                    data={filteredData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    strokeWidth={2}
                    stroke="var(--background)"
                >
                    {filteredData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.fill || "var(--color-primary)"}
                            className="hover:opacity-80 transition-opacity duration-200"
                        />
                    ))}
                    {innerValue !== undefined && (
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-2xl font-bold"
                                            >
                                                {innerValue}
                                            </tspan>
                                            {innerLabel && (
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 20}
                                                    className="fill-muted-foreground text-xs"
                                                >
                                                    {innerLabel}
                                                </tspan>
                                            )}
                                        </text>
                                    )
                                }
                            }}
                        />
                    )}
                </Pie>
                {showLegend && (
                    <ChartLegend
                        content={<ChartLegendContent nameKey="name" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                )}
            </PieChart>
        </ChartContainer>
    )
}
