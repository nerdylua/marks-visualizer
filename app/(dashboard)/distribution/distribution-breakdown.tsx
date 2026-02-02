"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { GradeDistribution } from "@/lib/data/types"
import { cn } from "@/lib/utils"

interface DistributionBreakdownProps {
    gradeDistribution: GradeDistribution
    subjectDistributions: {
        subject: string
        distribution: GradeDistribution
        passRate: number
    }[]
    totalStudents: number
}

const gradeInfo = [
    { grade: 'O', label: 'Outstanding', range: '90% - 100%', color: 'bg-emerald-500' },
    { grade: 'A+', label: 'Excellent', range: '80% - 89%', color: 'bg-teal-500' },
    { grade: 'A', label: 'Very Good', range: '70% - 79%', color: 'bg-cyan-500' },
    { grade: 'B+', label: 'Good', range: '60% - 69%', color: 'bg-blue-500' },
    { grade: 'B', label: 'Above Average', range: '50% - 59%', color: 'bg-orange-500' },
    { grade: 'C', label: 'Average', range: '40% - 49%', color: 'bg-yellow-500' },
    { grade: 'F', label: 'Fail', range: 'Below 40%', color: 'bg-red-500' },
] as const

const subjectColors: Record<string, string> = {
    POME: 'bg-purple-500',
    DBMS: 'bg-cyan-500',
    AIML: 'bg-green-500',
    TOC: 'bg-orange-500',
    Elective: 'bg-pink-500',
}

export function DistributionBreakdown({
    gradeDistribution,
    subjectDistributions,
    totalStudents,
}: DistributionBreakdownProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Grade Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {gradeInfo.map(({ grade, label, range, color }) => {
                            const count = gradeDistribution[grade as keyof GradeDistribution]
                            const percentage = (count / totalStudents) * 100

                            return (
                                <div key={grade} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("size-3 rounded-full", color)} />
                                            <span className="font-medium">{grade}</span>
                                            <span className="text-muted-foreground">({label})</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-muted-foreground text-xs">{range}</span>
                                            <span className="font-mono font-semibold w-20 text-right">
                                                {count} ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-500", color)}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Subject-wise Pass Rates</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {subjectDistributions.map(({ subject, passRate }) => {
                            const color = subjectColors[subject] || 'bg-primary'

                            return (
                                <div key={subject} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("size-3 rounded-full", color)} />
                                            <span className="font-medium">{subject}</span>
                                        </div>
                                        <span className="font-mono font-semibold">
                                            {passRate.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-500", color)}
                                            style={{ width: `${passRate}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Subject-wise Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-2 font-medium">Subject</th>
                                    {gradeInfo.map(({ grade }) => (
                                        <th key={grade} className="text-center py-3 px-2 font-medium">
                                            {grade}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {subjectDistributions.map(({ subject, distribution }) => (
                                    <tr key={subject} className="border-b last:border-0">
                                        <td className="py-3 px-2 font-medium">{subject}</td>
                                        {gradeInfo.map(({ grade, color }) => {
                                            const count = distribution[grade as keyof GradeDistribution]
                                            return (
                                                <td key={grade} className="text-center py-3 px-2">
                                                    <span
                                                        className={cn(
                                                            "inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-full text-xs font-medium",
                                                            count > 0 ? `${color}/20 text-foreground` : "bg-muted text-muted-foreground"
                                                        )}
                                                    >
                                                        {count}
                                                    </span>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
