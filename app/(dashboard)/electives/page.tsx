import { loadStudentData } from "@/lib/data/loader"
import {
    getElectiveDistributionChartData,
    getElectiveScoreDistributionData,
    getStudentsByElective,
} from "@/lib/data/transformers"
import { mean } from "@/lib/data/statistics"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { ElectivePieChart } from "@/components/charts/elective-pie-chart"
import { ElectiveTabs } from "./elective-tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ELECTIVE_COLORS } from "@/lib/data/constants"

import { Users, Award } from "lucide-react"

export default async function ElectivesPage() {
    const students = await loadStudentData()

    const distributionData = getElectiveDistributionChartData(students)
    const scoreDistributionData = getElectiveScoreDistributionData(students)

    const topByElective = {
        cc: getStudentsByElective(students, 'Cloud Computing'),
        nlp: getStudentsByElective(students, 'NLP'),
        qc: getStudentsByElective(students, 'Quantum Computing'),
    }

    const ccAvg = mean(topByElective.cc.map(s => s.elective.score).filter((s): s is number => s !== null))
    const nlpAvg = mean(topByElective.nlp.map(s => s.elective.score).filter((s): s is number => s !== null))
    const qcAvg = mean(topByElective.qc.map(s => s.elective.score).filter((s): s is number => s !== null))

    const highestAvgElective = ccAvg >= nlpAvg && ccAvg >= qcAvg
        ? 'Cloud Computing'
        : nlpAvg >= qcAvg
            ? 'NLP'
            : 'Quantum Computing'

    return (
        <div className="space-y-6">
            <PageHeader
                title="Elective Comparison"
                description="Compare performance across different elective courses"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Cloud Computing"
                    value={topByElective.cc.length}
                    description={`Avg: ${ccAvg.toFixed(1)}`}
                    icon={Users}
                />
                <StatCard
                    title="NLP"
                    value={topByElective.nlp.length}
                    description={`Avg: ${nlpAvg.toFixed(1)}`}
                    icon={Users}
                />
                <StatCard
                    title="Quantum Computing"
                    value={topByElective.qc.length}
                    description={`Avg: ${qcAvg.toFixed(1)}`}
                    icon={Users}
                />
                <StatCard
                    title="Highest Average"
                    value={highestAvgElective}
                    description="Best performing elective"
                    icon={Award}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <ChartCard
                    title="Enrollment Distribution"
                    description="Number of students in each elective"
                >
                    <ElectivePieChart
                        data={distributionData}
                        className="min-h-[300px] w-full"
                    />
                </ChartCard>

                <Card>
                    <CardHeader>
                        <CardTitle>Score Comparison</CardTitle>
                        <CardDescription>Mean scores and ranges by elective</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {scoreDistributionData.map((data) => (
                            <div key={data.elective} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{data.elective}</span>
                                    <span className="font-mono text-muted-foreground">
                                        {data.min} - {data.max}
                                    </span>
                                </div>
                                <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full transition-all"
                                        style={{
                                            width: `${data.mean}%`,
                                            backgroundColor: ELECTIVE_COLORS[data.elective as keyof typeof ELECTIVE_COLORS],
                                        }}
                                    />
                                    <div
                                        className="absolute top-0 bottom-0 w-0.5 bg-foreground"
                                        style={{ left: `${data.mean}%` }}
                                        title={`Mean: ${data.mean.toFixed(1)}`}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Mean: {data.mean.toFixed(1)}</span>
                                    <span>Median: {data.median.toFixed(1)}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <ElectiveTabs
                ccStudents={topByElective.cc}
                nlpStudents={topByElective.nlp}
                qcStudents={topByElective.qc}
            />
        </div>
    )
}
