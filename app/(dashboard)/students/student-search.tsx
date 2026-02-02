"use client"

import { useState, useMemo } from "react"
import { Search, User, Award, TrendingUp } from "lucide-react"

import { Student, SubjectKey } from "@/lib/data/types"
import { SUBJECTS } from "@/lib/data/constants"
import { searchStudents, getStudentRadarData } from "@/lib/data/transformers"
import { getStudentPercentileRank, getStudentRank } from "@/lib/data/statistics"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

                    {searchResults.length > 0 && !selectedStudent && (
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

                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ← Search for another student
                            </button>
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
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <Search className="size-12 opacity-50" />
                        <div>
                            <p className="text-lg font-medium">Search for a student</p>
                            <p className="text-sm">Enter a name or USN to view their performance profile</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
