"use client"
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { threadValidation } from '@/lib/validations/thread';
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
import { useTransition } from 'react';
import { updateUser } from '@/lib/actions/userActions';
import { usePathname,useRouter } from 'next/navigation';
import { createThread } from '@/lib/actions/threadActions';
import { ChangeEvent } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64Image, isBase64Video } from '@/lib/utils';
import { useOrganization } from '@clerk/nextjs';
export interface Props{
    user:{
        id:string;
        objectID:string;
        username:string;
        name:string;
        bio:string;
        image:string;
    };
    btnTitle:string;
}



export default function PostThread({userId}:{userId:string}){
    const [isPending,startTransition]=useTransition()
    const {organization}=useOrganization()
    let [files,setFiles]=useState<File[]>([])
    let {startUpload}=useUploadThing("media")
    const pathname=usePathname()
    const router=useRouter()
    const handleChange=(e:ChangeEvent<HTMLInputElement>,fieldChange:(value:string)=>void)=>{
        e.preventDefault()
        const fileReader=new FileReader()
        if (e.target?.files && e.target?.files.length){
            const file=e.target.files[0]
            setFiles(Array.from(e.target.files))
            if (!(file.type?.includes('image') || file.type?.includes('video') || file.type?.includes('audio'))){
                return
            }
            fileReader.onload=async (event)=>{
                const fileDataUrl=event.target?.result?.toString() || ''
                fieldChange(fileDataUrl)
            }
            fileReader.readAsDataURL(file)
        }
    }

    const onSubmit=async (values:z.infer<typeof threadValidation>)=>{
        startTransition(async ()=>{
            if (values.file!== ''){
                const blob=values.file 
                let hasFileChanged=false
                if (blob.includes('image')){
                    hasFileChanged=isBase64Image(blob)
                }
                else if (blob.includes('video')){
                    hasFileChanged=isBase64Video(blob)
                }
                else{
                    return
                }
    
                if (hasFileChanged){
                    const fileRes=await startUpload(files)
                    if (fileRes && fileRes[0].url){
                        values.file=fileRes[0].url
                    }
                }    
            }
            await createThread({
                text:values.thread,
                author:values.accountId,
                file:values.file,
                communityId:organization? organization.id : null,
                path:pathname
            })

            router.push('/')
        })
    }

    const removeFile=(fieldChange:(value:string)=>void):void =>{
        fieldChange('')
    }

    let form=useForm<z.infer<typeof threadValidation>>({
        resolver : zodResolver(threadValidation),
        defaultValues: {
            thread:'',
            accountId:userId,
            file:'',
        }
    })
    return (
        <section>
        {(isPending)?(
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
            </div>
        ):(
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" mt-10 space-y-8">
            <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 w-full">
                    <FormLabel className=" text-base-semibold text-light-2">
                        Content
                    </FormLabel>
                    <FormControl className=' no-focus bg-dark-3 border border-dark-4 text-light-1'>
                        <Textarea 
                            rows={10}
                            placeholder="Create your Thread"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                    <FormLabel className="">
                        {
                            (field.value==='')? (
                                <div className='flex flex-row gap-3.5'>
                                <div className=' cursor-pointer flex items-center'>
                                    <Image 
                                        src="/assets/picture-svgrepo-com.svg"
                                        alt="file icon"
                                        width={28}
                                        height={28}
                                    />
                                </div>                
                                </div>
                            ):(
                                <div className='flex flex-col'>
                                    <div className='flex flex-row justify-start -mb-7 z-10'>
                                        <Image
                                            src="/assets/cross-mark-button-svgrepo-com.svg"
                                            alt="cross icon"
                                            width={28}
                                            height={28}
                                            className=' cursor-pointer'
                                            onClick={(e)=>{
                                                e.preventDefault()
                                                removeFile(field.onChange)
                                            }}
                                        />
                                    </div>
                                    {
                                        (field.value.includes('image'))? (
                                            <Image
                                                src={field.value}
                                                alt='image'
                                                width={500}
                                                height={500}
                                            />
                                        ):(
                                            <video
                                                src={field.value}
                                                width={600}
                                                height={600}
                                                controls={true}
                                                loop={true}
                                            />
                                        )
                                    }
                                    
                                </div>
                            )
                        }
                    
                    </FormLabel>
                    {
                        (field.value==='')? (
                            <FormControl className=' flex-1 text-base1-semibold text-gray-200'>
                                <Input 
                                    type='file'
                                    accept='video/*,image/*'
                                    placeholder="Upload your photo"
                                    className='account-form_image-input hidden'
                                    onChange={(e)=>handleChange(e,field.onChange)}
                                />
                            </FormControl>
                        ):(<></>)
                    }
                    
                    <FormMessage/>
                    
                    </FormItem>
                )}
                />
    
                
                <Button type='submit' className=' bg-primary-500'>Post Thread</Button>
                
            </form>
            </Form>

        )}
        </section>
    )
}