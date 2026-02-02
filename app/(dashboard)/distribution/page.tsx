import { loadStudentData } from "@/lib/data/loader"
import { getClassOverview, getSubjectStats } from "@/lib/data/statistics"
import {
    getGradeDistributionChartData,
    getCumulativeDistribution,
} from "@/lib/data/transformers"
import { SUBJECTS } from "@/lib/data/constants"
import { SubjectKey } from "@/lib/data/types"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { GradePieChart } from "@/components/charts/grade-pie-chart"
import { CumulativeAreaChart } from "@/components/charts/cumulative-area-chart"
import { DistributionBreakdown } from "./distribution-breakdown"

import { Award, Users, TrendingUp, TrendingDown } from "lucide-react"

export default async function DistributionPage() {
    const students = await loadStudentData()
    const overview = getClassOverview(students)

    const gradeDistribution = getGradeDistributionChartData(overview.gradeDistribution)
    const cumulativeData = getCumulativeDistribution(students)

    const passedCount = students.filter(s => s.percentage >= 40).length
    const failedCount = students.length - passedCount

    const subjectKeys: SubjectKey[] = ['pome', 'dbms', 'aiml', 'toc', 'elective']
    const subjectDistributions = subjectKeys.map(key => {
        const stats = getSubjectStats(students, key)
        return {
            subject: SUBJECTS[key].shortName,
            distribution: stats.distribution,
            passRate: stats.passRate,
        }
    })

    return (
        <div className="space-y-6">
            <PageHeader
                title="Class Distribution"
                description="Overall grade distribution and performance tiers"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Passed"
                    value={passedCount}
                    description={`${((passedCount / students.length) * 100).toFixed(1)}% pass rate`}
                    icon={TrendingUp}
                />
                <StatCard
                    title="Total Failed"
                    value={failedCount}
                    description={`${((failedCount / students.length) * 100).toFixed(1)}% of class`}
                    icon={TrendingDown}
                />
                <StatCard
                    title="Outstanding (O)"
                    value={overview.gradeDistribution.O}
                    description="90% and above"
                    icon={Award}
                />
                <StatCard
                    title="Class Size"
                    value={students.length}
                    description="5th Semester CSE"
                    icon={Users}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <ChartCard
                    title="Overall Grade Distribution"
                    description="Number of students in each grade category"
                >
                    <GradePieChart
                        data={gradeDistribution}
                        className="min-h-[350px] w-full"
                        innerValue={students.length}
                        innerLabel="Total"
                    />
                </ChartCard>

                <ChartCard
                    title="Cumulative Distribution"
                    description="Percentage of students at or below each score"
                >
                    <CumulativeAreaChart
                        data={cumulativeData}
                        className="min-h-[350px] w-full"
                    />
                </ChartCard>
            </div>

            <DistributionBreakdown
                gradeDistribution={overview.gradeDistribution}
                subjectDistributions={subjectDistributions}
                totalStudents={students.length}
            />
        </div>
    )
}
