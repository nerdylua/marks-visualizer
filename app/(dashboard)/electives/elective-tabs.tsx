"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Student } from "@/lib/data/types"
import { cn } from "@/lib/utils"
import { getTopStudents } from "@/lib/data/transformers"
import { mean, stdDev, median } from "@/lib/data/statistics"

interface ElectiveTabsProps {
    ccStudents: Student[]
    nlpStudents: Student[]
    qcStudents: Student[]
}

const gradeColors: Record<string, string> = {
    O: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "A+": "bg-teal-500/10 text-teal-500 border-teal-500/20",
    A: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    "B+": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    B: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    C: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    F: "bg-red-500/10 text-red-500 border-red-500/20",
}

function ElectiveStats({ students }: { students: Student[] }) {
    const scores = students
        .map(s => s.elective.score)
        .filter((s): s is number => s !== null)

    const stats = {
        total: students.length,
        mean: mean(scores),
        median: median(scores),
        stdDev: stdDev(scores),
        min: scores.length > 0 ? Math.min(...scores) : 0,
        max: scores.length > 0 ? Math.max(...scores) : 0,
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Students</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xl font-bold">{stats.mean.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Mean</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xl font-bold">{stats.median.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Median</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xl font-bold">{stats.stdDev.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Std Dev</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xl font-bold">{stats.min}</p>
                <p className="text-xs text-muted-foreground">Min</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xl font-bold">{stats.max}</p>
                <p className="text-xs text-muted-foreground">Max</p>
            </div>
        </div>
    )
}

function TopPerformersTable({ students }: { students: Student[] }) {
    const sorted = [...students]
        .filter(s => s.elective.score !== null)
        .sort((a, b) => (b.elective.score ?? 0) - (a.elective.score ?? 0))
        .slice(0, 10)

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden sm:table-cell">USN</TableHead>
                    <TableHead className="text-right">Elective Score</TableHead>
                    <TableHead className="text-right">Overall %</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sorted.map((student, index) => (
                    <TableRow key={student.usn} className="group transition-colors">
                        <TableCell className="text-center font-mono text-sm text-muted-foreground">
                            {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                            <span className="truncate max-w-[200px] block">
                                {student.name}
                            </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell font-mono text-sm text-muted-foreground">
                            {student.usn}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                            {student.elective.score}/100
                        </TableCell>
                        <TableCell className="text-right">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "font-semibold",
                                    gradeColors[student.grade] || "bg-muted text-muted-foreground"
                                )}
                            >
                                {student.percentage.toFixed(1)}%
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export function ElectiveTabs({
    ccStudents,
    nlpStudents,
    qcStudents,
}: ElectiveTabsProps) {
    const electives = [
        { key: 'cc', name: 'Cloud Computing', students: ccStudents },
        { key: 'nlp', name: 'NLP', students: nlpStudents },
        { key: 'qc', name: 'Quantum Computing', students: qcStudents },
    ]

    return (
        <Tabs defaultValue="cc" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
                {electives.map((elective) => (
                    <TabsTrigger key={elective.key} value={elective.key}>
                        {elective.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            {electives.map((elective) => (
                <TabsContent key={elective.key} value={elective.key} className="space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-4">{elective.name} Statistics</h3>
                            <ElectiveStats students={elective.students} />

                            <h4 className="font-semibold mb-4">Top 10 Performers</h4>
                            <TopPerformersTable students={elective.students} />
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    )
}
