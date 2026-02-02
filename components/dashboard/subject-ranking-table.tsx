"use client"

import { Student, SubjectKey } from "@/lib/data/types"
import { SUBJECTS } from "@/lib/data/constants"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SubjectRankingTableProps {
    students: Student[]
    subjectKey: SubjectKey
    limit?: number
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

function getSubjectScore(student: Student, key: SubjectKey): number | null {
    if (key === 'elective') {
        return student.elective.score
    }
    return student[key] as number | null
}

function getSubjectPercentage(score: number | null, maxMarks: number): number {
    if (score === null) return 0
    return (score / maxMarks) * 100
}

function getSubjectGrade(percentage: number): string {
    if (percentage >= 90) return 'O'
    if (percentage >= 80) return 'A+'
    if (percentage >= 70) return 'A'
    if (percentage >= 60) return 'B+'
    if (percentage >= 50) return 'B'
    if (percentage >= 40) return 'C'
    return 'F'
}

export function SubjectRankingTable({
    students,
    subjectKey,
    limit = 15,
}: SubjectRankingTableProps) {
    const subject = SUBJECTS[subjectKey]

    const rankedStudents = [...students]
        .filter(s => getSubjectScore(s, subjectKey) !== null)
        .sort((a, b) => {
            const scoreA = getSubjectScore(a, subjectKey) ?? 0
            const scoreB = getSubjectScore(b, subjectKey) ?? 0
            return scoreB - scoreA
        })
        .slice(0, limit)

    return (
        <div className="relative overflow-auto max-h-[500px]">
            <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead className="hidden sm:table-cell">USN</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">%</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rankedStudents.map((student, index) => {
                        const score = getSubjectScore(student, subjectKey)
                        const percentage = getSubjectPercentage(score, subject.maxMarks)
                        const grade = getSubjectGrade(percentage)

                        return (
                            <TableRow
                                key={student.usn}
                                className="group transition-colors"
                            >
                                <TableCell className="text-center font-mono text-sm text-muted-foreground">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                    <span className="truncate max-w-[180px] block">
                                        {student.name}
                                    </span>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell font-mono text-sm text-muted-foreground">
                                    {student.usn}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {score !== null ? score : "N/A"}/{subject.maxMarks}
                                </TableCell>
                                <TableCell className="text-right font-mono font-semibold">
                                    {percentage.toFixed(1)}%
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "font-semibold",
                                            gradeColors[grade] || "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {grade}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
