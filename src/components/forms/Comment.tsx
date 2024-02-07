"use client";
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { commentValidation } from '@/lib/validations/thread';
import * as z from "zod"
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

import { updateUser } from '@/lib/actions/userActions';
import { usePathname,useRouter } from 'next/navigation';
import { addCommentToThread, createThread } from '@/lib/actions/threadActions';
import { ChangeEvent } from 'react';
import { useUploadThing } from '@/lib/uploadthing';

interface Props{
    threadId:string;
    currentUserImg:string;
    currentUserId:string;
}

export default function Comment({
    threadId,
    currentUserImg,
    currentUserId
}:Props){
    const pathname=usePathname()
    const onSubmit=async (values:z.infer<typeof commentValidation>)=>{
        await addCommentToThread({
            threadId:threadId,
            userId:currentUserId,
            commentText:values.thread,
            path:pathname
        })
        form.reset()
    }

    let form=useForm<z.infer<typeof commentValidation>>({
        resolver : zodResolver(commentValidation),
        defaultValues: {
            thread:''
        }
    })
    
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
            
            control={form.control}
            name="thread"
            render={({ field }) => (
                <FormItem className=" flex items-center w-full gap-3">
                <FormLabel>
                    <Image
                        src={currentUserImg}
                        width={48}
                        height={48}
                        alt='user'
                        className=' rounded-full object-cover'
                    />
                </FormLabel>
                <FormControl className=' border-none bg-transparent'>
                    <Input 
                        className='text-light-1 no-focus'
                        type='text'
                        placeholder="Add a Comment..."
                        {...field}
                    />
                </FormControl>
                
                </FormItem>
            )}
            
        />
        <Button type='submit' className='comment-form_btn'>Reply</Button>
        </form>
        </Form>
    )
}