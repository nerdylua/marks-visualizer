"use client"

import { useState, useMemo } from "react"
import { Student, SubjectKey } from "@/lib/data/types"
import { SUBJECTS } from "@/lib/data/constants"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SubjectRankingTableProps {
    students: Student[]
    subjectKey: SubjectKey
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
}: SubjectRankingTableProps) {
    const [pageSize, setPageSize] = useState<number>(15)
    const [currentPage, setCurrentPage] = useState(1)

    const subject = SUBJECTS[subjectKey]

    const rankedStudents = useMemo(() =>
        [...students]
            .filter(s => getSubjectScore(s, subjectKey) !== null)
            .sort((a, b) => {
                const scoreA = getSubjectScore(a, subjectKey) ?? 0
                const scoreB = getSubjectScore(b, subjectKey) ?? 0
                return scoreB - scoreA
            }),
        [students, subjectKey]
    )

    const totalStudents = rankedStudents.length
    const totalPages = Math.ceil(totalStudents / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalStudents)
    const paginatedStudents = rankedStudents.slice(startIndex, endIndex)

    const handlePageSizeChange = (value: string) => {
        const newSize = value === "all" ? totalStudents : parseInt(value)
        setPageSize(newSize)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {totalStudents} students ranked
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <Select
                        value={pageSize === totalStudents ? "all" : pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="w-[75px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="relative overflow-auto max-h-[400px]">
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
                        {paginatedStudents.map((student, index) => {
                            const score = getSubjectScore(student, subjectKey)
                            const percentage = getSubjectPercentage(score, subject.maxMarks)
                            const grade = getSubjectGrade(percentage)
                            const rank = startIndex + index + 1

                            return (
                                <TableRow
                                    key={student.usn}
                                    className="group transition-colors"
                                >
                                    <TableCell className="text-center">
                                        {rank <= 3 ? (
                                            <span className={cn(
                                                "inline-flex size-7 items-center justify-center rounded-full font-bold text-sm",
                                                rank === 1 && "bg-yellow-500/20 text-yellow-500",
                                                rank === 2 && "bg-slate-400/20 text-slate-400",
                                                rank === 3 && "bg-amber-600/20 text-amber-600"
                                            )}>
                                                {rank}
                                            </span>
                                        ) : (
                                            <span className="font-mono text-sm text-muted-foreground">{rank}</span>
                                        )}
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

            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                        {startIndex + 1}-{endIndex} of {totalStudents}
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <div className="flex items-center gap-1 px-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number
                                if (totalPages <= 5) {
                                    pageNum = i + 1
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i
                                } else {
                                    pageNum = currentPage - 2 + i
                                }
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "ghost"}
                                        size="icon"
                                        className="size-8"
                                        onClick={() => setCurrentPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
