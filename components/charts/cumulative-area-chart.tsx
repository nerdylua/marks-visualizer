"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { BarChartData } from "@/lib/data/types"

interface CumulativeAreaChartProps {
    data: BarChartData[]
    className?: string
}

const chartConfig = {
    value: {
        label: "Students %",
        color: "oklch(0.65 0.18 200)",
    },
} satisfies ChartConfig

export function CumulativeAreaChart({
    data,
    className,
}: CumulativeAreaChartProps) {
    return (
        <ChartContainer config={chartConfig} className={className}>
            <AreaChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                accessibilityLayer
            >
                <defs>
                    <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="0%"
                            stopColor="oklch(0.65 0.18 200)"
                            stopOpacity={0.5}
                        />
                        <stop
                            offset="100%"
                            stopColor="oklch(0.65 0.18 200)"
                            stopOpacity={0.05}
                        />
                    </linearGradient>
                </defs>
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
                    cursor={{ stroke: "var(--color-muted-foreground)", strokeWidth: 1 }}
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, props) => [
                                `${value}% of students scored at or below ${props.payload?.name}`,
                                "",
                            ]}
                        />
                    }
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="oklch(0.65 0.18 200)"
                    strokeWidth={2}
                    fill="url(#cumulativeGradient)"
                    className="transition-all duration-200"
                />
            </AreaChart>
        </ChartContainer>
    )
}
