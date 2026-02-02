"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Cell,
} from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { BarChartData } from "@/lib/data/types"

interface SubjectBarChartProps {
    data: BarChartData[]
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
                <ChartTooltip
                    cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
                    content={
                        <ChartTooltipContent
                            formatter={(value) => [`${value}%`, "Average"]}
                        />
                    }
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
