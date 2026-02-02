import { loadStudentData } from "@/lib/data/loader"
import {
    getElectiveDistributionChartData,
    getElectiveComparisonData,
    getStudentsByElective,
    getTopStudents
} from "@/lib/data/transformers"
import { getSubjectStats, mean } from "@/lib/data/statistics"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { ElectivePieChart } from "@/components/charts/elective-pie-chart"
import { ElectiveComparisonChart } from "@/components/charts/elective-comparison-chart"
import { ElectiveTabs } from "./elective-tabs"

import { Users, TrendingUp, Award, BookOpen } from "lucide-react"

export default async function ElectivesPage() {
    const students = await loadStudentData()

    const distributionData = getElectiveDistributionChartData(students)
    const comparisonData = getElectiveComparisonData(students)

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

                <ChartCard
                    title="Average Score Comparison"
                    description="Compare average scores across electives"
                >
                    <ElectiveComparisonChart
                        data={comparisonData}
                        className="min-h-[300px] w-full"
                        dataKey="average"
                    />
                </ChartCard>
            </div>

            <ChartCard
                title="Pass Rate Comparison"
                description="Percentage of students who passed (≥40%) in each elective"
            >
                <ElectiveComparisonChart
                    data={comparisonData}
                    className="min-h-[200px] w-full"
                    dataKey="passRate"
                />
            </ChartCard>

            <ElectiveTabs
                ccStudents={topByElective.cc}
                nlpStudents={topByElective.nlp}
                qcStudents={topByElective.qc}
            />
        </div>
    )
}
