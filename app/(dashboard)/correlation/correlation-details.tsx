"use client"

import { useState } from "react"
import { Student, SubjectKey } from "@/lib/data/types"
import { SUBJECTS } from "@/lib/data/constants"
import { getCorrelationScatterData } from "@/lib/data/transformers"
import { ChartCard } from "@/components/dashboard/chart-card"
import { CorrelationScatterChart } from "@/components/charts/correlation-scatter-chart"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface CorrelationDetailsProps {
    students: Student[]
    correlationPairs: { x: SubjectKey; y: SubjectKey; value: number }[]
}

function getCorrelationDescription(value: number): { icon: typeof TrendingUp; label: string; color: string } {
    if (value >= 0.7) return { icon: TrendingUp, label: "Strong Positive", color: "text-emerald-500" }
    if (value >= 0.5) return { icon: TrendingUp, label: "Moderate Positive", color: "text-emerald-400" }
    if (value >= 0.3) return { icon: TrendingUp, label: "Weak Positive", color: "text-emerald-300" }
    if (value >= -0.3) return { icon: Minus, label: "No Correlation", color: "text-muted-foreground" }
    if (value >= -0.5) return { icon: TrendingDown, label: "Weak Negative", color: "text-red-300" }
    if (value >= -0.7) return { icon: TrendingDown, label: "Moderate Negative", color: "text-red-400" }
    return { icon: TrendingDown, label: "Strong Negative", color: "text-red-500" }
}

export function CorrelationDetails({ students, correlationPairs }: CorrelationDetailsProps) {
    const [selectedX, setSelectedX] = useState<SubjectKey>(correlationPairs[0]?.x || 'pome')
    const [selectedY, setSelectedY] = useState<SubjectKey>(correlationPairs[0]?.y || 'dbms')

    const subjectKeys: SubjectKey[] = ['pome', 'dbms', 'aiml', 'toc', 'elective']

    const currentPair = correlationPairs.find(
        p => (p.x === selectedX && p.y === selectedY) || (p.x === selectedY && p.y === selectedX)
    )
    const currentCorrelation = currentPair?.value ?? 0

    const scatterData = getCorrelationScatterData(students, selectedX, selectedY)
    const description = getCorrelationDescription(currentCorrelation)
    const Icon = description.icon

    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4">Strongest Correlations</h4>
                    <div className="flex flex-wrap gap-2">
                        {correlationPairs.slice(0, 6).map(pair => {
                            const desc = getCorrelationDescription(pair.value)
                            return (
                                <button
                                    key={`${pair.x}-${pair.y}`}
                                    onClick={() => {
                                        setSelectedX(pair.x)
                                        setSelectedY(pair.y)
                                    }}
                                    className={`
                                        flex items-center gap-2 px-3 py-2 rounded-lg border 
                                        transition-all hover:bg-muted/50
                                        ${selectedX === pair.x && selectedY === pair.y
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border'}
                                    `}
                                >
                                    <span className="text-sm font-medium">
                                        {SUBJECTS[pair.x].shortName} × {SUBJECTS[pair.y].shortName}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={desc.color}
                                    >
                                        {pair.value.toFixed(2)}
                                    </Badge>
                                </button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <ChartCard
                title={`${SUBJECTS[selectedX].shortName} vs ${SUBJECTS[selectedY].shortName}`}
                description="Scatter plot showing relationship between subject scores"
                action={
                    <div className="flex items-center gap-2">
                        <Select value={selectedX} onValueChange={(v) => setSelectedX(v as SubjectKey)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {subjectKeys.map(key => (
                                    <SelectItem key={key} value={key}>
                                        {SUBJECTS[key].shortName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-muted-foreground">vs</span>
                        <Select value={selectedY} onValueChange={(v) => setSelectedY(v as SubjectKey)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {subjectKeys.map(key => (
                                    <SelectItem key={key} value={key}>
                                        {SUBJECTS[key].shortName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted/30">
                        <Icon className={`size-6 ${description.color}`} />
                        <div className="text-center">
                            <p className={`text-2xl font-bold font-mono ${description.color}`}>
                                r = {currentCorrelation.toFixed(3)}
                            </p>
                            <p className="text-sm text-muted-foreground">{description.label}</p>
                        </div>
                    </div>

                    <CorrelationScatterChart
                        data={scatterData}
                        xLabel={SUBJECTS[selectedX].shortName}
                        yLabel={SUBJECTS[selectedY].shortName}
                        className="min-h-[400px] w-full"
                    />
                </div>
            </ChartCard>

            <Card>
                <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Interpretation</h4>
                    <p className="text-sm text-muted-foreground">
                        {currentCorrelation >= 0.5 ? (
                            <>
                                Students who score well in <strong>{SUBJECTS[selectedX].shortName}</strong> tend
                                to also score well in <strong>{SUBJECTS[selectedY].shortName}</strong>.
                            </>
                        ) : currentCorrelation >= 0.3 ? (
                            <>
                                There is a weak positive relationship between <strong>{SUBJECTS[selectedX].shortName}</strong> and{" "}
                                <strong>{SUBJECTS[selectedY].shortName}</strong> scores.
                            </>
                        ) : currentCorrelation >= -0.3 ? (
                            <>
                                There is little to no correlation between <strong>{SUBJECTS[selectedX].shortName}</strong> and{" "}
                                <strong>{SUBJECTS[selectedY].shortName}</strong>.
                            </>
                        ) : (
                            <>
                                There is a negative correlation between <strong>{SUBJECTS[selectedX].shortName}</strong> and{" "}
                                <strong>{SUBJECTS[selectedY].shortName}</strong>.
                            </>
                        )}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
