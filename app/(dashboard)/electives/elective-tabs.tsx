"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Student } from "@/lib/data/types"
import { cn } from "@/lib/utils"
import { mean, stdDev, median } from "@/lib/data/statistics"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

function PaginatedPerformersTable({ students }: { students: Student[] }) {
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState(1)

    const sorted = [...students]
        .filter(s => s.elective.score !== null)
        .sort((a, b) => (b.elective.score ?? 0) - (a.elective.score ?? 0))

    const totalStudents = sorted.length
    const totalPages = Math.ceil(totalStudents / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalStudents)
    const paginatedStudents = sorted.slice(startIndex, endIndex)

    const handlePageSizeChange = (value: string) => {
        const newSize = value === "all" ? totalStudents : parseInt(value)
        setPageSize(newSize)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                    All Students ({totalStudents})
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <Select
                        value={pageSize === totalStudents ? "all" : pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="relative overflow-auto max-h-[500px]">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-12 text-center">#</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead className="hidden sm:table-cell">USN</TableHead>
                            <TableHead className="text-right">Elective Score</TableHead>
                            <TableHead className="text-right">Overall %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedStudents.map((student, index) => (
                            <TableRow key={student.usn} className="group transition-colors">
                                <TableCell className="text-center font-mono text-sm text-muted-foreground">
                                    {startIndex + index + 1}
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
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-muted-foreground">
                        Showing {startIndex + 1}-{endIndex} of {totalStudents}
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <div className="flex items-center gap-1 px-2">
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
                            <PaginatedPerformersTable students={elective.students} />
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    )
}
