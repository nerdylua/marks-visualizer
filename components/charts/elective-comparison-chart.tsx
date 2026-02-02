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

interface ElectiveComparisonData {
    elective: string
    average: number
    count: number
    passRate: number
}

interface ElectiveComparisonChartProps {
    data: ElectiveComparisonData[]
    className?: string
    dataKey?: "average" | "passRate"
}

const chartConfig = {
    average: {
        label: "Average Score",
    },
    passRate: {
        label: "Pass Rate %",
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

const ELECTIVE_COLORS: Record<string, string> = {
    "Cloud Computing": "oklch(0.65 0.18 200)",
    NLP: "oklch(0.7 0.15 280)",
    "Quantum Computing": "oklch(0.65 0.22 320)",
}

export function ElectiveComparisonChart({
    data,
    className,
    dataKey = "average",
}: ElectiveComparisonChartProps) {
    return (
        <ChartContainer config={chartConfig} className={className}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                accessibilityLayer
                layout="vertical"
            >
                <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    className="stroke-border/30"
                />
                <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-xs"
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}`}
                />
                <YAxis
                    type="category"
                    dataKey="elective"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    width={120}
                    className="text-xs"
                />
                <ChartTooltip
                    cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, props) => {
                                const item = props.payload
                                return [
                                    `${dataKey === "average" ? `${value} avg` : `${value}%`} (${item.count} students)`,
                                    item.elective,
                                ]
                            }}
                        />
                    }
                />
                <Bar
                    dataKey={dataKey}
                    radius={[0, 6, 6, 0]}
                    className="transition-all duration-200"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={ELECTIVE_COLORS[entry.elective] || "var(--color-primary)"}
                            className="hover:opacity-80 transition-opacity"
                        />
                    ))}
                </Bar>
            </BarChart>
        </ChartContainer>
    )
}
