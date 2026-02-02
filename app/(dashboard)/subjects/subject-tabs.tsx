"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartCard } from "@/components/dashboard/chart-card"
import { DistributionHistogram } from "@/components/charts/distribution-histogram"
import { GradePieChart } from "@/components/charts/grade-pie-chart"
import { SubjectRankingTable } from "@/components/dashboard/subject-ranking-table"
import { SUBJECTS } from "@/lib/data/constants"
import { SubjectKey, SubjectStats, DistributionBucket, BarChartData, Student } from "@/lib/data/types"
import { Card, CardContent } from "@/components/ui/card"

interface SubjectTabsProps {
    distributionData: Record<SubjectKey, DistributionBucket[]>
    gradeData: Record<SubjectKey, BarChartData[]>
    allStats: { key: SubjectKey; stats: SubjectStats }[]
    students: Student[]
}

export function SubjectTabs({
    distributionData,
    gradeData,
    allStats,
    students,
}: SubjectTabsProps) {
    const subjectKeys: SubjectKey[] = ['pome', 'dbms', 'aiml', 'toc', 'elective']

    return (
        <Tabs defaultValue="pome" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                {subjectKeys.map((key) => (
                    <TabsTrigger
                        key={key}
                        value={key}
                        className="text-xs sm:text-sm"
                    >
                        {SUBJECTS[key].shortName}
                    </TabsTrigger>
                ))}
            </TabsList>

            {subjectKeys.map((key) => {
                const stats = allStats.find((s) => s.key === key)?.stats
                if (!stats) return null

                return (
                    <TabsContent key={key} value={key} className="space-y-4">
                        <Card className="bg-gradient-to-r from-card to-card/50">
                            <CardContent className="pt-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {SUBJECTS[key].name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Max Marks: {SUBJECTS[key].maxMarks} | {stats.totalStudents} Students
                                        </p>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">{stats.mean.toFixed(1)}</p>
                                            <p className="text-xs text-muted-foreground">Mean</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">{stats.median.toFixed(1)}</p>
                                            <p className="text-xs text-muted-foreground">Median</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">{stats.stdDev.toFixed(1)}</p>
                                            <p className="text-xs text-muted-foreground">Std Dev</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">{stats.passRate.toFixed(0)}%</p>
                                            <p className="text-xs text-muted-foreground">Pass Rate</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <ChartCard
                                title="Score Distribution"
                                description="Frequency distribution of scores"
                            >
                                <DistributionHistogram
                                    data={distributionData[key]}
                                    color={SUBJECTS[key].color}
                                    className="min-h-[300px] w-full"
                                />
                            </ChartCard>

                            <ChartCard
                                title="Grade Breakdown"
                                description="Grade distribution for this subject"
                            >
                                <GradePieChart
                                    data={gradeData[key]}
                                    className="min-h-[300px] w-full"
                                    innerValue={stats.totalStudents}
                                    innerLabel="Students"
                                />
                            </ChartCard>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <ChartCard
                                title="Top 15 Performers"
                                description={`Highest scoring students in ${SUBJECTS[key].shortName}`}
                            >
                                <SubjectRankingTable
                                    students={students}
                                    subjectKey={key}
                                    limit={15}
                                />
                            </ChartCard>

                            <Card>
                                <CardContent className="pt-6">
                                    <h4 className="font-semibold mb-4">Percentile Breakdown</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                                            <p className="text-xl font-bold">{stats.percentiles.p25.toFixed(1)}</p>
                                            <p className="text-xs text-muted-foreground">25th Percentile</p>
                                        </div>
                                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                                            <p className="text-xl font-bold">{stats.percentiles.p50.toFixed(1)}</p>
                                            <p className="text-xs text-muted-foreground">50th Percentile</p>
                                        </div>
                                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                                            <p className="text-xl font-bold">{stats.percentiles.p75.toFixed(1)}</p>
                                            <p className="text-xs text-muted-foreground">75th Percentile</p>
                                        </div>
                                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                                            <p className="text-xl font-bold">{stats.percentiles.p90.toFixed(1)}</p>
                                            <p className="text-xs text-muted-foreground">90th Percentile</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t">
                                        <h4 className="font-semibold mb-3">Score Range</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 text-center">
                                                <p className="text-lg font-bold text-red-500">{stats.min}</p>
                                                <p className="text-xs text-muted-foreground">Minimum</p>
                                            </div>
                                            <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
                                            <div className="flex-1 text-center">
                                                <p className="text-lg font-bold text-green-500">{stats.max}</p>
                                                <p className="text-xs text-muted-foreground">Maximum</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                )
            })}
        </Tabs>
    )
}
