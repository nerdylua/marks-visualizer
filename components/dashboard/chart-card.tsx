import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartCardProps {
    title: string
    description?: string
    children: React.ReactNode
    className?: string
    action?: React.ReactNode
}

export function ChartCard({
    title,
    description,
    children,
    className,
    action,
}: ChartCardProps) {
    return (
        <Card className={cn(
            "transition-all duration-200",
            "bg-card/50 backdrop-blur-sm",
            "border-border/50 hover:border-border",
            className
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold tracking-tight">
                        {title}
                    </CardTitle>
                    {description && (
                        <CardDescription className="text-sm text-muted-foreground">
                            {description}
                        </CardDescription>
                    )}
                </div>
                {action && (
                    <div className="flex items-center gap-2">
                        {action}
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-0">
                {children}
            </CardContent>
        </Card>
    )
}

export function ChartCardSkeleton({ className }: { className?: string }) {
    return (
        <Card className={cn("bg-card/50", className)}>
            <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full" />
            </CardContent>
        </Card>
    )
}
