import { Student } from "@/lib/data/types"
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

interface TopStudentsTableProps {
    students: Student[]
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

export function TopStudentsTable({ students }: TopStudentsTableProps) {
    return (
        <div className="relative overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead className="hidden sm:table-cell">USN</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map((student, index) => (
                        <TableRow
                            key={student.usn}
                            className="group transition-colors"
                        >
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
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
