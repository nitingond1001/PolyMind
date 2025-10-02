"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// Fancy Dark Mode Toggle
function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="relative flex items-center w-16 h-8 rounded-full transition-all duration-500 
                                   bg-gray-300 dark:bg-gray-700 shadow-inner hover:scale-105 active:scale-95"
                    >
                        {/* Moving circle */}
                        <span
                            className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center
                                        bg-white dark:bg-black shadow-md transform transition-all duration-500
                                        ${theme === "dark" ? "translate-x-8" : "translate-x-0"}`}
                        >
                            {theme === "light" ? (
                                <Sun className="w-4 h-4 text-gray-500 transition-all duration-300" />
                            ) : (
                                <Moon className="w-4 h-4 text-indigo-400 transition-all duration-300" />
                            )}
                        </span>

                        {/* Background glow */}
                        <span
                            className={`absolute inset-0 rounded-full blur-md transition-opacity duration-500
                                        ${theme === "light" ? "bg-gray-500/40 opacity-70" : "bg-indigo-500/40 opacity-70"}`}
                        />
                    </button>
                </TooltipTrigger>
            </Tooltip>
        </TooltipProvider>
    )
}

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Image src={'/logo.svg'} alt="logo" width={60} height={60}
                                className="w-[40px] h-[40px]"
                            />
                            <h2 className="font-bold text-xl">PolyMind</h2>
                        </div>
                        {/* 🔥 Replaced with fancy ThemeToggle */}
                        <div>
                            <ThemeToggle />
                        </div>
                    </div>
                    <Button className='mt-7 w-full' size="lg">+ New Chat</Button>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className={'p-3'}>
                        <h2 className="font-bold text-lg">Chat</h2>
                        <p className="text-sm text-gray-400">Sign in to start chatting with multiple AI model</p>
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-3 mb-10">
                    <Button className={'w-full'} size={'lg'}>Sign In/Sign Up</Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
