"use client"

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { StudentRadarData } from "@/lib/data/types"

interface StudentRadarChartProps {
    data: StudentRadarData[]
    studentName?: string
    className?: string
}

const chartConfig = {
    student: {
        label: "Student",
        color: "oklch(0.7 0.2 145)",
    },
    classAverage: {
        label: "Class Average",
        color: "oklch(0.6 0.15 250)",
    },
} satisfies ChartConfig

export function StudentRadarChart({
    data,
    studentName = "Student",
    className,
}: StudentRadarChartProps) {
    return (
        <ChartContainer config={chartConfig} className={className}>
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid
                    className="stroke-border/50"
                    radialLines={false}
                />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    tickLine={false}
                />
                <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                    axisLine={false}
                    tickCount={5}
                />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={(value, name) => [
                                `${value}%`,
                                name === "student" ? studentName : "Class Average",
                            ]}
                        />
                    }
                />
                <Radar
                    name="classAverage"
                    dataKey="classAverage"
                    stroke="var(--color-classAverage)"
                    fill="var(--color-classAverage)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                />
                <Radar
                    name="student"
                    dataKey="student"
                    stroke="var(--color-student)"
                    fill="var(--color-student)"
                    fillOpacity={0.4}
                    strokeWidth={2}
                />
                <ChartLegend content={<ChartLegendContent />} />
            </RadarChart>
        </ChartContainer>
    )
}
