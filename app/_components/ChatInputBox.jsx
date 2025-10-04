import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React from 'react'
import AIMultiModels from './AIMultiModels'

function ChatInputBox() {
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
                    className='border-0 outline-none'
                />
                <div className='mt-3 flex justify-between items-center'>
                    <Button className='cursor-pointer' variant={'ghost'} size={'icon'}>
                        <Paperclip className='h-5 w-5'/>
                    </Button>
                    <div className='flex gap-5'>
                        <Button variant={'ghost'} size={'icon'} className='cursor-pointer'><Mic /></Button>
                        <Button size={'icon'} className={'bg-indigo-500 cursor-pointer'}><Send /></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatInputBox