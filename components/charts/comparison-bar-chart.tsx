"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { SubjectComparisonData } from "@/lib/data/types"

interface ComparisonBarChartProps {
    data: SubjectComparisonData[]
    className?: string
}

const chartConfig = {
    average: {
        label: "Average",
        color: "oklch(0.65 0.18 200)",
    },
    highest: {
        label: "Highest",
        color: "oklch(0.7 0.2 145)",
    },
    lowest: {
        label: "Lowest",
        color: "oklch(0.65 0.2 25)",
    },
} satisfies ChartConfig

export function ComparisonBarChart({
    data,
    className,
}: ComparisonBarChartProps) {
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
                    dataKey="subject"
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
                            formatter={(value) => [`${value}%`]}
                        />
                    }
                />
                <Bar
                    dataKey="lowest"
                    fill="var(--color-lowest)"
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-200"
                />
                <Bar
                    dataKey="average"
                    fill="var(--color-average)"
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-200"
                />
                <Bar
                    dataKey="highest"
                    fill="var(--color-highest)"
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-200"
                />
                <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
        </ChartContainer>
    )
}
