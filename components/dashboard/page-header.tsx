"use client"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
    title: string
    description?: string
    children?: React.ReactNode
    className?: string
}

export function PageHeader({
    title,
    description,
    children,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn(
            "flex flex-col gap-1 pb-6 md:flex-row md:items-center md:justify-between md:gap-4",
            className
        )}>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-muted-foreground md:text-base">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-2 pt-2 md:pt-0">
                    {children}
                </div>
            )}
        </div>
    )
}
