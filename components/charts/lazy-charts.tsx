"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { ComponentType } from "react"

function ChartSkeleton({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Skeleton className="h-full w-full min-h-[300px]" />
        </div>
    )
}

export const LazySubjectBarChart = dynamic(
    () => import("./subject-bar-chart").then((mod) => mod.SubjectBarChart),
    {
        loading: () => <ChartSkeleton className="min-h-[300px]" />,
        ssr: false,
    }
)

export const LazyGradePieChart = dynamic(
    () => import("./grade-pie-chart").then((mod) => mod.GradePieChart),
    {
        loading: () => <ChartSkeleton className="min-h-[300px]" />,
        ssr: false,
    }
)

export const LazyElectivePieChart = dynamic(
    () => import("./elective-pie-chart").then((mod) => mod.ElectivePieChart),
    {
        loading: () => <ChartSkeleton className="min-h-[280px]" />,
        ssr: false,
    }
)

export const LazyStudentRadarChart = dynamic(
    () => import("./student-radar-chart").then((mod) => mod.StudentRadarChart),
    {
        loading: () => <ChartSkeleton className="min-h-[350px]" />,
        ssr: false,
    }
)

export const LazyDistributionHistogram = dynamic(
    () => import("./distribution-histogram").then((mod) => mod.DistributionHistogram),
    {
        loading: () => <ChartSkeleton className="min-h-[300px]" />,
        ssr: false,
    }
)

export const LazyComparisonBarChart = dynamic(
    () => import("./comparison-bar-chart").then((mod) => mod.ComparisonBarChart),
    {
        loading: () => <ChartSkeleton className="min-h-[300px]" />,
        ssr: false,
    }
)

export const LazyCumulativeAreaChart = dynamic(
    () => import("./cumulative-area-chart").then((mod) => mod.CumulativeAreaChart),
    {
        loading: () => <ChartSkeleton className="min-h-[350px]" />,
        ssr: false,
    }
)

export const LazyElectiveComparisonChart = dynamic(
    () => import("./elective-comparison-chart").then((mod) => mod.ElectiveComparisonChart),
    {
        loading: () => <ChartSkeleton className="min-h-[200px]" />,
        ssr: false,
    }
)

export const LazyCorrelationScatterChart = dynamic(
    () => import("./correlation-scatter-chart").then((mod) => mod.CorrelationScatterChart),
    {
        loading: () => <ChartSkeleton className="min-h-[400px]" />,
        ssr: false,
    }
)
