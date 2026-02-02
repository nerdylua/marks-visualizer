import { Suspense } from "react"
import { Users, TrendingUp, Award, BookOpen } from "lucide-react"

import { loadStudentData } from "@/lib/data/loader"
import { getClassOverview, getSubjectStats } from "@/lib/data/statistics"
import {
    getSubjectAveragesChartData,
    getGradeDistributionChartData,
    getElectiveDistributionChartData,
    getTopStudents,
} from "@/lib/data/transformers"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartCard, ChartCardSkeleton } from "@/components/dashboard/chart-card"
import { SubjectBarChart } from "@/components/charts/subject-bar-chart"
import { GradePieChart } from "@/components/charts/grade-pie-chart"
import { ElectivePieChart } from "@/components/charts/elective-pie-chart"
import { TopStudentsTable } from "./top-students-table"

export default async function OverviewPage() {
    const students = await loadStudentData()
    const overview = getClassOverview(students)

    const subjectAverages = getSubjectAveragesChartData(students)
    const gradeDistribution = getGradeDistributionChartData(overview.gradeDistribution)
    const electiveDistribution = getElectiveDistributionChartData(students)
    const topStudents = getTopStudents(students, 10)

    return (
        <div className="space-y-6">
            <PageHeader
                title="Overview"
                description="5th Semester CSE class performance at a glance"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Students"
                    value={overview.totalStudents}
                    description="5th Semester CSE"
                    icon={Users}
                />
                <StatCard
                    title="Class Average"
                    value={`${overview.averagePercentage.toFixed(1)}%`}
                    description="Overall percentage"
                    icon={TrendingUp}
                />
                <StatCard
                    title="Highest Score"
                    value={`${overview.highestPercentage.toFixed(1)}%`}
                    description={overview.topStudent.name}
                    icon={Award}
                />
                <StatCard
                    title="Subjects"
                    value="5"
                    description="4 Core + 1 Elective"
                    icon={BookOpen}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <ChartCard
                    title="Subject Performance"
                    description="Average scores across all subjects (normalized to %)"
                >
                    <SubjectBarChart
                        data={subjectAverages}
                        className="min-h-[300px] w-full"
                    />
                </ChartCard>

                <ChartCard
                    title="Grade Distribution"
                    description="Overall class grade breakdown"
                >
                    <GradePieChart
                        data={gradeDistribution}
                        className="min-h-[300px] w-full"
                        innerValue={overview.totalStudents}
                        innerLabel="Students"
                    />
                </ChartCard>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <ChartCard
                    title="Elective Enrollment"
                    description="Student distribution across electives"
                >
                    <ElectivePieChart
                        data={electiveDistribution}
                        className="min-h-[280px] w-full"
                    />
                </ChartCard>

                <div className="lg:col-span-2">
                    <ChartCard
                        title="Top 10 Performers"
                        description="Highest scoring students in the class"
                    >
                        <TopStudentsTable students={topStudents} />
                    </ChartCard>
                </div>
            </div>
        </div>
    )
}
