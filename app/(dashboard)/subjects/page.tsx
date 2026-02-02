import { loadStudentData } from "@/lib/data/loader"
import { getSubjectStats, getSubjectScores } from "@/lib/data/statistics"
import {
    getDistributionBuckets,
    getSubjectComparisonData,
    getGradeDistributionChartData
} from "@/lib/data/transformers"
import { SUBJECTS } from "@/lib/data/constants"
import { SubjectKey } from "@/lib/data/types"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { DistributionHistogram } from "@/components/charts/distribution-histogram"
import { ComparisonBarChart } from "@/components/charts/comparison-bar-chart"
import { GradePieChart } from "@/components/charts/grade-pie-chart"
import { SubjectTabs } from "./subject-tabs"

import { TrendingUp, TrendingDown, Users, Percent } from "lucide-react"

export default async function SubjectsPage() {
    const students = await loadStudentData()

    const subjectKeys: SubjectKey[] = ['pome', 'dbms', 'aiml', 'toc', 'elective']
    const allStats = subjectKeys.map(key => ({
        key,
        stats: getSubjectStats(students, key),
    }))

    const comparisonData = getSubjectComparisonData(students)

    const distributionData = subjectKeys.reduce((acc, key) => {
        const scores = getSubjectScores(students, key)
        acc[key] = getDistributionBuckets(scores, SUBJECTS[key].maxMarks, 10)
        return acc
    }, {} as Record<SubjectKey, ReturnType<typeof getDistributionBuckets>>)

    const gradeData = subjectKeys.reduce((acc, key) => {
        const stats = getSubjectStats(students, key)
        acc[key] = getGradeDistributionChartData(stats.distribution)
        return acc
    }, {} as Record<SubjectKey, ReturnType<typeof getGradeDistributionChartData>>)

    return (
        <div className="space-y-6">
            <PageHeader
                title="Subject Analysis"
                description="Deep dive into performance across all subjects"
            />

            <ChartCard
                title="Subject Comparison"
                description="Compare lowest, average, and highest scores across subjects"
            >
                <ComparisonBarChart
                    data={comparisonData}
                    className="min-h-[300px] w-full"
                />
            </ChartCard>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {allStats.map(({ key, stats }) => (
                    <StatCard
                        key={key}
                        title={SUBJECTS[key].shortName}
                        value={`${((stats.mean / SUBJECTS[key].maxMarks) * 100).toFixed(1)}%`}
                        description={`Pass rate: ${stats.passRate.toFixed(0)}%`}
                        icon={stats.passRate >= 80 ? TrendingUp : TrendingDown}
                    />
                ))}
            </div>

            <SubjectTabs
                distributionData={distributionData}
                gradeData={gradeData}
                allStats={allStats}
                students={students}
            />
        </div>
    )
}
