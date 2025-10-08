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
import { Moon, Sun, User2, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { SignInButton, useUser } from "@clerk/nextjs"
import UsageCreditProgress from "./UsageCreditProgress"
import { collection, doc, getDocs, query, where } from "firebase/firestore"
import { db } from "@/config/FirebaseConfig"
import moment from "moment"
import Link from "next/link"

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
                                   bg-gray-300 dark:bg-gray-700 shadow-inner hover:scale-105 active:scale-95 cursor-pointer"
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
    const { user } = useUser();
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        user && GetChatHistory();
    }, [user])

    const GetChatHistory = async () => {
        const q = query(collection(db, "chatHistory"), where("userEmail", '==', user?.primaryEmailAddress?.emailAddress));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.id, doc.data());
            setChatHistory(prev => [...prev, doc.data()])
        })
    }

    const GetLastUserMessageFromChat = (chat) => {
        const allMessages = Object.values(chat.messages).flat();
        const userMessages = allMessages.filter(msg => msg.role == 'user');

        const lastUserMsg = userMessages[userMessages.length - 1].content || null;

        const lastUpdated = chat.lastUpdated || Date.now();
        const formattedDate = moment(lastUpdated).fromNow();

        return {
            chatId: chat.chatId,
            message: lastUserMsg,
            lastMsgDate: formattedDate
        }
    }

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
                    {user ?
                        <Link href={'/'}>
                            <Button className='mt-7 w-full cursor-pointer' size="lg">+ New Chat</Button>
                        </Link> :
                        <SignInButton>
                            <Button className='mt-7 w-full' size="lg">+ New Chat</Button>
                        </SignInButton>}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className={'p-3'}>
                        <h2 className="font-bold text-lg">Chat</h2>
                        {!user && <p className="text-sm text-gray-400">Sign in to start chatting with multiple AI model</p>}

                        {chatHistory.map((chat, index) => {
                            const { message, lastMsgDate } = GetLastUserMessageFromChat(chat);

                            return (
                                <Link href={'?chatId=' + chat.chatId} key={index}>
                                    {/* Hover area */}
                                    <div
                                        className="p-2 rounded-md transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                                    >
                                        <h2 className="text-xs text-gray-400">{lastMsgDate}</h2>
                                        <h2 className="text-sm text-gray-800 dark:text-gray-200 truncate line-clamp-1">
                                            {message}
                                        </h2>
                                    </div>

                                    {/* Separator line outside hover area */}
                                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                </Link>
                            );
                        })}


                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-3 mb-10">
                    {!user ? <SignInButton mode="modal">
                        <Button className={'w-full'} size={'lg'}>Sign In/Sign Up</Button>
                    </SignInButton>
                        :
                        <div>
                            <UsageCreditProgress />
                            <Button className='w-full mb-3 cursor-pointer'><Zap /> Upgrade Plan</Button>
                            <Button className="flex cursor-pointer" variant={'ghost'}>
                                <User2 /> <h2>Settings</h2>
                            </Button>
                        </div>
                    }
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
