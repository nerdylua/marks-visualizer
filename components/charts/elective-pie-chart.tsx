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

interface ElectivePieChartProps {
    data: BarChartData[]
    className?: string
    showLegend?: boolean
}

const chartConfig = {
    count: {
        label: "Students",
    },
    "Cloud Computing": {
        label: "Cloud Computing",
        color: "oklch(0.65 0.18 200)",
    },
    NLP: {
        label: "NLP",
        color: "oklch(0.7 0.15 280)",
    },
    "Quantum Computing": {
        label: "Quantum Computing",
        color: "oklch(0.65 0.22 320)",
    },
} satisfies ChartConfig

export function ElectivePieChart({
    data,
    className,
    showLegend = true,
}: ElectivePieChartProps) {
    const total = useMemo(
        () => data.reduce((sum, item) => sum + item.value, 0),
        [data]
    )

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
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    strokeWidth={2}
                    stroke="var(--background)"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.fill || "var(--color-primary)"}
                            className="hover:opacity-80 transition-opacity duration-200"
                        />
                    ))}
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
                                            className="fill-foreground text-xl font-bold"
                                        >
                                            {total}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 18}
                                            className="fill-muted-foreground text-xs"
                                        >
                                            Total
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
                {showLegend && (
                    <ChartLegend
                        content={<ChartLegendContent nameKey="name" />}
                        className="-translate-y-2 flex-wrap gap-2"
                    />
                )}
            </PieChart>
        </ChartContainer>
    )
}
