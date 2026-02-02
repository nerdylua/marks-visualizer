"use client"

import { useState, useMemo } from "react"
import { Search, User, Award, TrendingUp, ArrowLeft, ChevronLeft, ChevronRight, Trophy } from "lucide-react"

import { Student, SubjectKey } from "@/lib/data/types"
import { SUBJECTS } from "@/lib/data/constants"
import { searchStudents, getStudentRadarData } from "@/lib/data/transformers"
import { getStudentPercentileRank, getStudentRank } from "@/lib/data/statistics"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { ChartCard } from "@/components/dashboard/chart-card"
import { StudentRadarChart } from "@/components/charts/student-radar-chart"
import { cn } from "@/lib/utils"

interface StudentSearchProps {
    students: Student[]
    classAverages: Record<SubjectKey, number>
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

function Leaderboard({ students, onSelectStudent }: { students: Student[]; onSelectStudent: (s: Student) => void }) {
    const [pageSize, setPageSize] = useState<number>(15)
    const [currentPage, setCurrentPage] = useState(1)

    const sorted = useMemo(() =>
        [...students].sort((a, b) => b.percentage - a.percentage),
        [students]
    )

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
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                            <Trophy className="size-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle>CSE Leaderboard</CardTitle>
                            <CardDescription>Click on a student to view their profile</CardDescription>
                        </div>
                    </div>
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
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="all">All</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative overflow-auto max-h-[500px]">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-16 text-center">Rank</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="hidden md:table-cell">USN</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">%</TableHead>
                                <TableHead className="text-center">Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedStudents.map((student, index) => {
                                const rank = startIndex + index + 1
                                return (
                                    <TableRow
                                        key={student.usn}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => onSelectStudent(student)}
                                    >
                                        <TableCell className="text-center">
                                            {rank <= 3 ? (
                                                <span className={cn(
                                                    "inline-flex size-8 items-center justify-center rounded-full font-bold",
                                                    rank === 1 && "bg-yellow-500/20 text-yellow-500",
                                                    rank === 2 && "bg-slate-400/20 text-slate-400",
                                                    rank === 3 && "bg-amber-600/20 text-amber-600"
                                                )}>
                                                    {rank}
                                                </span>
                                            ) : (
                                                <span className="font-mono text-muted-foreground">{rank}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <span className="truncate max-w-[200px] block">
                                                {student.name}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell font-mono text-sm text-muted-foreground">
                                            {student.usn}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {student.totalMarks}/600
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-semibold">
                                            {student.percentage.toFixed(1)}%
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "font-semibold",
                                                    gradeColors[student.grade] || "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {student.grade}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t mt-4">
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
            </CardContent>
        </Card>
    )
}

export function StudentSearch({ students, classAverages }: StudentSearchProps) {
    const [query, setQuery] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

    const searchResults = useMemo(() => {
        if (query.length < 2) return []
        return searchStudents(students, query).slice(0, 8)
    }, [students, query])

    const radarData = useMemo(() => {
        if (!selectedStudent) return []
        return getStudentRadarData(selectedStudent, classAverages)
    }, [selectedStudent, classAverages])

    const studentRank = useMemo(() => {
        if (!selectedStudent) return 0
        return getStudentRank(selectedStudent, students)
    }, [selectedStudent, students])

    const percentileRank = useMemo(() => {
        if (!selectedStudent) return 0
        return getStudentPercentileRank(selectedStudent, students)
    }, [selectedStudent, students])

    return (
        <div className="space-y-6">
            {!selectedStudent && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or USN..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {searchResults.length > 0 && (
                            <div className="mt-2 rounded-md border bg-popover shadow-lg">
                                {searchResults.map((student) => (
                                    <button
                                        key={student.usn}
                                        onClick={() => {
                                            setSelectedStudent(student)
                                            setQuery("")
                                        }}
                                        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors first:rounded-t-md last:rounded-b-md"
                                    >
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-sm text-muted-foreground">{student.usn}</p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn(gradeColors[student.grade])}
                                        >
                                            {student.grade}
                                        </Badge>
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {selectedStudent ? (
                <div className="space-y-6">
                    <Card className="bg-gradient-to-r from-card via-card to-primary/5">
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                                        <User className="size-8 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                                        <p className="text-muted-foreground font-mono">{selectedStudent.usn}</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold">{selectedStudent.percentage.toFixed(1)}%</p>
                                        <p className="text-xs text-muted-foreground">Overall</p>
                                    </div>
                                    <div className="text-center">
                                        <Badge
                                            variant="outline"
                                            className={cn("text-lg px-3 py-1", gradeColors[selectedStudent.grade])}
                                        >
                                            {selectedStudent.grade}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">Grade</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setSelectedStudent(null)}
                                className="mt-4"
                            >
                                <ArrowLeft className="size-4 mr-2" />
                                Search Another Student
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Class Rank
                                </CardTitle>
                                <Award className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">
                                    #{studentRank} <span className="text-sm font-normal text-muted-foreground">of {students.length}</span>
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Percentile
                                </CardTitle>
                                <TrendingUp className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">
                                    {percentileRank.toFixed(0)}th <span className="text-sm font-normal text-muted-foreground">percentile</span>
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Elective
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-semibold">{selectedStudent.elective.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    Score: {selectedStudent.elective.score ?? "N/A"}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <ChartCard
                            title="Performance Profile"
                            description="Student performance vs class average"
                        >
                            <StudentRadarChart
                                data={radarData}
                                studentName={selectedStudent.name}
                                className="min-h-[350px] w-full"
                            />
                        </ChartCard>

                        <ChartCard
                            title="Subject Scores"
                            description="Marks obtained in each subject"
                        >
                            <div className="space-y-4 p-2">
                                {(['pome', 'dbms', 'aiml', 'toc'] as const).map((key) => {
                                    const score = selectedStudent[key] as number | null
                                    const maxMarks = SUBJECTS[key].maxMarks
                                    const percentage = score !== null ? (score / maxMarks) * 100 : 0
                                    const classAvgPercentage = (classAverages[key] / maxMarks) * 100

                                    return (
                                        <div key={key} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">{SUBJECTS[key].shortName}</span>
                                                <span className="font-mono">
                                                    {score ?? "N/A"} / {maxMarks}
                                                </span>
                                            </div>
                                            <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: SUBJECTS[key].color,
                                                    }}
                                                />
                                                <div
                                                    className="absolute top-0 bottom-0 w-0.5 bg-foreground/50"
                                                    style={{ left: `${classAvgPercentage}%` }}
                                                    title={`Class avg: ${classAverages[key].toFixed(1)}`}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}

                                <div className="space-y-2 pt-2 border-t">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{selectedStudent.elective.name}</span>
                                        <span className="font-mono">
                                            {selectedStudent.elective.score ?? "N/A"} / 100
                                        </span>
                                    </div>
                                    <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${selectedStudent.elective.score ?? 0}%`,
                                                backgroundColor: SUBJECTS.elective.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </ChartCard>
                    </div>
                </div>
            ) : (
                <Leaderboard students={students} onSelectStudent={setSelectedStudent} />
            )}
        </div>
    )
}
