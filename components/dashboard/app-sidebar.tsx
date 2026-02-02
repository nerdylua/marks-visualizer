"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BarChart3,
    BookOpen,
    GitBranch,
    GraduationCap,
    Home,
    LayoutGrid,
    PieChart,
    Users,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
    {
        title: "Overview",
        href: "/",
        icon: Home,
    },
    {
        title: "Subject Analysis",
        href: "/subjects",
        icon: BookOpen,
    },
    {
        title: "Student Lookup",
        href: "/students",
        icon: Users,
    },
    {
        title: "Elective Comparison",
        href: "/electives",
        icon: LayoutGrid,
    },
    {
        title: "Distribution",
        href: "/distribution",
        icon: PieChart,
    },
    {
        title: "Correlation",
        href: "/correlation",
        icon: GitBranch,
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="border-b border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" className="flex items-center gap-3">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-chart-1 to-chart-2">
                                    <BarChart3 className="size-4 text-white" />
                                </div>
                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate font-semibold tracking-tight">
                                        Marks Visualizer
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        5th Sem CSE
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
                        Analytics
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center justify-between px-2 py-1">
                            <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                                <GraduationCap className="size-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                    332 Students
                                </span>
                            </div>
                            <ThemeToggle />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
