"use client"

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    ZAxis,
} from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
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
                <ChartTooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, props) => {
                                const point = props.payload
                                return [
                                    `${point.name} (${point.usn})`,
                                    `${xLabel}: ${point.x}%, ${yLabel}: ${point.y}%`,
                                ]
                            }}
                        />
                    }
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
