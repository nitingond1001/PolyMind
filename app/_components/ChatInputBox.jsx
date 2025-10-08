import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import AIMultiModels from './AIMultiModels'
import { AISelectedModelContext } from '@/context/AISelectedModelContext';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

function ChatInputBox() {
    const [userInput, setUserInput] = useState("");
    const { aiSelectedModels, setAISelectedModels, messages, setMessages } = useContext(AISelectedModelContext);
    const { user } = useUser();
    const [chatId, setChatId] = useState();
    const params = useSearchParams();

    useEffect(() => {
        const chatId_ = params.get('chatId')
        if (chatId_) {
            setChatId(chatId_);
            GetMessages(chatId_);
        }
        else {
            setMessages([]);
            setChatId(uuidv4())
        }
    }, [params])

    const handleSend = async () => {
        if (!userInput.trim()) return;

        // 1. Add user message to all enabled models
        setMessages((prev) => {
            const updated = { ...prev };
            Object.keys(aiSelectedModels).forEach((modelKey) => {
                if (aiSelectedModels[modelKey].enable) {
                    updated[modelKey] = [
                        ...(updated[modelKey] ?? []),
                        { role: "user", content: userInput },
                    ];
                }
            });

            return updated;
        });

        const currentInput = userInput; //Capture before reset
        setUserInput("");

        // 2.Fetch response from each enabled model
        Object.entries(aiSelectedModels).forEach(async ([parentModel, modelInfo]) => {
            if (!modelInfo.modelId || aiSelectedModels[parentModel].enable == false) return;

            //Add loading placeholder before API call
            setMessages((prev) => ({
                ...prev,
                [parentModel]: [
                    ...(prev[parentModel] ?? []),
                    { role: "assistant", content: "Thinking...", model: parentModel, loading: true },
                ],
            }));

            try {
                const result = await axios.post("/api/ai-multi-model", {
                    model: modelInfo.modelId,
                    msg: [{ role: "user", content: currentInput }],
                    parentModel,
                });

                const { aiResponse, model } = result.data;

                // 3.Add AI response to that model's messages
                setMessages((prev) => {
                    const updated = [...(prev[parentModel] ?? [])];
                    const loadingIndex = updated.findIndex((m) => m.loading);

                    if (loadingIndex !== -1) {
                        updated[loadingIndex] = {
                            role: "assistant",
                            content: aiResponse,
                            model,
                            loading: false,
                        };
                    } else {
                        //fallback if no loading msg found
                        updated.push({
                            role: "assistant",
                            content: aiResponse,
                            model,
                            loading: false,
                        });
                    }

                    return { ...prev, [parentModel]: updated };
                });
            } catch (err) {
                console.error(err);
                setMessages((prev) => ({
                    ...prev,
                    [parentModel]: [
                        ...(prev[parentModel] ?? []),
                        { role: "assistant", content: "⚠️ Error fetching response." },
                    ],
                }));
            }
        });
    };

    useEffect(() => {
        if (messages) {
            SaveMessages();
        }
    }, [messages])

    const SaveMessages = async () => {
        const docRef = doc(db, 'chatHistory', chatId);

        await setDoc(docRef, {
            chatId: chatId,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            messages: messages,
            lastUpdated: Date.now()
        })
    }

    const GetMessages = async (chatId) => {
        console.log("INSDE", chatId)
        const docRef = doc(db, 'chatHistory', chatId);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        const docData = docSnap.data();
        setMessages(docData.messages)
    }

    return (
        <div className='relative min-h-screen'>
            {/* Page Content */}
            <div>
                <AIMultiModels />
            </div>
            {/* Fixed Chat Input */}
            <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4'>
                <div className='w-full border rounded-xl shadow-md max-w-2xl p-4 bg-background'>
                    <input type='text'
                        placeholder='Ask me anything...'
                        className='border-0 outline-none w-full'
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                    />
                    <div className='mt-3 flex justify-between items-center'>
                        <Button className='cursor-pointer' variant={'ghost'} size={'icon'}>
                            <Paperclip className='h-5 w-5' />
                        </Button>
                        <div className='flex gap-5'>
                            <Button variant={'ghost'} size={'icon'} className='cursor-pointer'><Mic /></Button>
                            <Button size={'icon'} className={'bg-indigo-500 cursor-pointer'} onClick={handleSend}><Send /></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInputBox