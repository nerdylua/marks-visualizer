import { loadStudentData } from "@/lib/data/loader"
import { getCorrelationScatterData, getClassAverages } from "@/lib/data/transformers"
import { computeCorrelation } from "@/lib/data/statistics"
import { SUBJECTS } from "@/lib/data/constants"
import { SubjectKey } from "@/lib/data/types"

import { PageHeader } from "@/components/dashboard/page-header"
import { ChartCard } from "@/components/dashboard/chart-card"
import { CorrelationMatrix } from "./correlation-matrix"
import { CorrelationDetails } from "./correlation-details"

export default async function CorrelationPage() {
    const students = await loadStudentData()

    const subjectKeys: SubjectKey[] = ['pome', 'dbms', 'aiml', 'toc', 'elective']

    const correlationMatrix: Record<string, Record<string, number>> = {}

    subjectKeys.forEach(subjectX => {
        correlationMatrix[subjectX] = {}
        subjectKeys.forEach(subjectY => {
            const correlation = computeCorrelation(students, subjectX, subjectY)
            correlationMatrix[subjectX][subjectY] = correlation
        })
    })

    const correlationPairs: { x: SubjectKey; y: SubjectKey; value: number }[] = []
    subjectKeys.forEach((subjectX, i) => {
        subjectKeys.slice(i + 1).forEach(subjectY => {
            correlationPairs.push({
                x: subjectX,
                y: subjectY,
                value: correlationMatrix[subjectX][subjectY],
            })
        })
    })

    correlationPairs.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))

    return (
        <div className="space-y-6">
            <PageHeader
                title="Correlation Analysis"
                description="Explore relationships between subject performances"
            />

            <ChartCard
                title="Correlation Matrix"
                description="Pearson correlation coefficients between subject scores (1 = perfect positive, -1 = perfect negative, 0 = no correlation)"
            >
                <CorrelationMatrix
                    matrix={correlationMatrix}
                    subjectKeys={subjectKeys}
                />
            </ChartCard>

            <CorrelationDetails
                students={students}
                correlationPairs={correlationPairs}
            />
        </div>
    )
}
