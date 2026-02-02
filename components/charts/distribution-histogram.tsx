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
    type ChartConfig,
} from "@/components/ui/chart"
import { DistributionBucket } from "@/lib/data/types"

interface DistributionHistogramProps {
    data: DistributionBucket[]
    className?: string
    color?: string
    title?: string
}

const chartConfig = {
    count: {
        label: "Students",
        color: "oklch(0.65 0.18 200)",
    },
} satisfies ChartConfig

export function DistributionHistogram({
    data,
    className,
    color = "oklch(0.65 0.18 200)",
    title,
}: DistributionHistogramProps) {
    return (
        <ChartContainer config={chartConfig} className={className}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                accessibilityLayer
            >
                <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-border/30"
                />
                <XAxis
                    dataKey="range"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    className="text-xs"
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-xs"
                />
                <ChartTooltip
                    cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, props) => [
                                `${value} students (${props.payload?.percentage?.toFixed(1)}%)`,
                                "Count",
                            ]}
                        />
                    }
                />
                <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-200"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={color}
                            className="hover:opacity-80 transition-opacity"
                        />
                    ))}
                </Bar>
            </BarChart>
        </ChartContainer>
    )
}
