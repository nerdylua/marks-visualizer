import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon?: LucideIcon
    trend?: {
        value: number
        label: string
        isPositive?: boolean
    }
    className?: string
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
}: StatCardProps) {
    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-200 hover:shadow-lg",
            "bg-gradient-to-br from-card to-card/80",
            "border-border/50 hover:border-border",
            className
        )}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {Icon && (
                    <div className="rounded-md bg-muted/50 p-2">
                        <Icon className="size-4 text-muted-foreground" />
                    </div>
                )}
            </CardHeader>

            <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                    {value}
                </div>

                {(description || trend) && (
                    <div className="mt-1 flex items-center gap-2 text-xs">
                        {trend && (
                            <span
                                className={cn(
                                    "inline-flex items-center rounded-full px-1.5 py-0.5 font-medium",
                                    trend.isPositive
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-rose-500/10 text-rose-500"
                                )}
                            >
                                {trend.isPositive ? "+" : ""}
                                {trend.value}%
                            </span>
                        )}
                        {description && (
                            <span className="text-muted-foreground">{description}</span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
