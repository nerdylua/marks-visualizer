"use client"

import { SUBJECTS } from "@/lib/data/constants"
import { SubjectKey } from "@/lib/data/types"
import { cn } from "@/lib/utils"

interface CorrelationMatrixProps {
    matrix: Record<string, Record<string, number>>
    subjectKeys: SubjectKey[]
}

function getCorrelationColor(value: number): string {
    const absValue = Math.abs(value)

    if (value >= 0.7) return "bg-emerald-500 text-white"
    if (value >= 0.5) return "bg-emerald-400/80 text-white"
    if (value >= 0.3) return "bg-emerald-300/60 text-foreground"
    if (value >= 0.1) return "bg-emerald-200/40 text-foreground"
    if (value >= -0.1) return "bg-muted text-muted-foreground"
    if (value >= -0.3) return "bg-red-200/40 text-foreground"
    if (value >= -0.5) return "bg-red-300/60 text-foreground"
    if (value >= -0.7) return "bg-red-400/80 text-white"
    return "bg-red-500 text-white"
}

function getCorrelationLabel(value: number): string {
    const absValue = Math.abs(value)
    if (absValue >= 0.7) return "Strong"
    if (absValue >= 0.5) return "Moderate"
    if (absValue >= 0.3) return "Weak"
    return "Very Weak"
}

export function CorrelationMatrix({ matrix, subjectKeys }: CorrelationMatrixProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="p-2 text-xs font-medium text-muted-foreground" />
                        {subjectKeys.map(key => (
                            <th
                                key={key}
                                className="p-2 text-xs font-medium text-center min-w-[80px]"
                            >
                                {SUBJECTS[key].shortName}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {subjectKeys.map(rowKey => (
                        <tr key={rowKey}>
                            <td className="p-2 text-xs font-medium text-right pr-4">
                                {SUBJECTS[rowKey].shortName}
                            </td>
                            {subjectKeys.map(colKey => {
                                const value = matrix[rowKey][colKey]
                                const isDiagonal = rowKey === colKey

                                return (
                                    <td
                                        key={colKey}
                                        className={cn(
                                            "p-2 text-center border border-border/50 transition-all",
                                            isDiagonal
                                                ? "bg-primary/20 text-primary font-bold"
                                                : getCorrelationColor(value)
                                        )}
                                    >
                                        <div className="text-sm font-mono font-semibold">
                                            {value.toFixed(2)}
                                        </div>
                                        {!isDiagonal && (
                                            <div className="text-[10px] opacity-75">
                                                {getCorrelationLabel(value)}
                                            </div>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Correlation:</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-red-500" />
                    <span className="text-xs">-1.0</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-red-300/60" />
                    <span className="text-xs">-0.5</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-muted" />
                    <span className="text-xs">0</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-emerald-300/60" />
                    <span className="text-xs">+0.5</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-emerald-500" />
                    <span className="text-xs">+1.0</span>
                </div>
            </div>
        </div>
    )
}
