import AIModelList from './../../shared/AIModelList'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Loader, Lock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SelectLabel } from '@radix-ui/react-select'
import { AISelectedModelContext } from '@/context/AISelectedModelContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { useUser } from '@clerk/nextjs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function AIMultiModels() {
    const { user } = useUser();
    const [aiModelList, setAIModelList] = useState(AIModelList)
    const { aiSelectedModels, setAISelectedModels, messages, setMessages } = useContext(AISelectedModelContext);

    const onToggleChange = (model, value) => {
        setAIModelList((prev) =>
            prev.map((m) =>
                m.model === model ? { ...m, enable: value } : m))

        setAISelectedModels((prev) => ({
            ...prev,
            [model]: {
                ...(prev?.[model] ?? {}),
                enable: value
            }
        }))
    }

    console.log(aiSelectedModels);

    const onSelectValue = async (parentModel, value) => {
        setAISelectedModels(prev => ({
            ...prev,
            [parentModel]: {
                modelId: value
            }
        }))
        
    }

    return (
        <div className='flex flex-1 h-[75vh] border-t border-b'>
            {aiModelList.map((model, index) => (
                <div
                    key={index}
                    className={`flex flex-col border-r h-full overflow-auto transition-all
                ${model.enable ? 'flex-1 min-w-[400px]' : 'w-[100px] flex-none'}`}>

                    <div className='flex w-full h-[70px] items-center justify-between border-b p-4'>
                        <div className='flex items-center gap-4 w-full'>
                            <Image src={model.icon}
                                alt={model.model}
                                width={24}
                                height={24}
                            />

                            {
                                model.enable && (
                                    <Select defaultValue={aiSelectedModels[model.model]?.modelId || "Select a model"}
                                        onValueChange={(value) => onSelectValue(model.model, value)}
                                        disabled={model.premium}
                                    >
                                        <SelectTrigger className="w-[180px] cursor-pointer">
                                            <SelectValue placeholder={aiSelectedModels[model.model]?.modelId || "Select a model"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup className="px-3">
                                                <SelectLabel className='text-sm text-gray-400'>Free</SelectLabel>
                                                {model.subModel.map((subModel, i) => subModel.premium == false && (
                                                    <SelectItem key={i} value={subModel.id} className='cursor-pointer'>
                                                        {subModel.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                            <SelectGroup className="px-3">
                                                <SelectLabel className='text-sm text-gray-400'>Premium</SelectLabel>
                                                {model.subModel.map((subModel, i) => subModel.premium == true && (
                                                    <SelectItem key={i} value={subModel.name} disabled={subModel.premium} className='cursor-pointer'>
                                                        {subModel.name} {subModel.premium && <Lock className='h-4 w-4' />}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )
                            }
                        </div>
                        <div>
                            {model.enable ? (
                                <Switch
                                    checked={model.enable}
                                    onCheckedChange={(v) => onToggleChange(model.model, v)}
                                    className='cursor-pointer'
                                />
                            ) : (
                                <MessageSquare
                                    className="cursor-pointer h-5 w-5"
                                    onClick={() => onToggleChange(model.model, true)}
                                />
                            )}
                        </div>
                    </div>
                    {model.premium && model.enable && <div className='flex items-center justify-center h-full'>
                        <Button className='cursor-pointer'> <Lock />Upgrade to unlock</Button>
                    </div>}

                    {model.enable && <div className='flex-1 p-4'>
                        <div className='flex-1 p-4 space-y-2'>
                            {messages[model.model]?.map((m, i) => (
                                <div
                                    key={m.id ?? i}
                                    className={`p-2 rounded-md ${m.role == 'user' ?
                                        "bg-indigo-100 text-indigo-900"
                                        : "bg-gray-100 text-gray-900"
                                        }`}
                                >
                                    {m.role == 'assistant' && (
                                        <span className='text-sm text-gray-400'>{m.model ?? model.model}</span>
                                    )}
                                    <div className='flex gap-3 items-center'>
                                        {m.content == 'Thinking' && <><Loader className='animate-spin' /><span>Loading..</span></>}</div>
                                    {m.content !== 'Thinking' &&
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {m.content}
                                        </ReactMarkdown>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            ))}

        </div>
    )
}

export default AIMultiModels