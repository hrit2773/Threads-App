"use client"
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from '@/lib/validations/user';
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
import { Input } from "@/components/ui/input"
import { ChangeEvent, useState } from 'react';
import { Textarea } from '../ui/textarea';
import {useUploadThing} from '@/lib/uploadthing'
import { isBase64Image } from '@/lib/utils';
import { updateUser } from '@/lib/actions/userActions';
import { usePathname,useRouter } from 'next/navigation';

export interface Props{
    user:{
        id:string;
        objectID:string | null;
        username:string;
        name:string;
        bio:string;
        image:string;
    };
    btnTitle:string;
}

export default function AccountProfile({user,btnTitle}:Props){
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
            if (!file.type?.includes('image')){
                return
            }
            fileReader.onload=async (event)=>{
                const imageDataUrl=event.target?.result?.toString() || ''
                fieldChange(imageDataUrl)
            }
            fileReader.readAsDataURL(file)
        }
    }
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const blob=values.profile_photo
        const hasImageChanged=isBase64Image(blob)
        if (hasImageChanged){
            const imgRes=await startUpload(files)
            if (imgRes && imgRes[0].url){
                values.profile_photo=imgRes[0].url
            }
        }    
        
        await updateUser({
            id:user.id,
            username:values.username,
            name:values.name,
            image:values.profile_photo,
            bio:values.bio,
            path:pathname,
        })
        if (pathname==="/profile/edit"){
            router.back()
        }
        else{
            router.push('/')
        }
    }

    let form=useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            profile_photo:user?.image,
            name:user?.name || "",
            username:user?.username || "",
            bio:user?.bio,
        }
    })

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                    {
                        (field.value)? <Image src={field.value} alt="profile photo" priority width={96} height={96}/> : <Image className="object-contain" src="/assets/profile.svg" alt="profile photo" width={24} height={24}/>
                        
                    }
                </FormLabel>
                <FormControl className=' flex-1 text-base1-semibold text-gray-200'>
                    <Input 
                        type='file'
                        accept='image/*'
                        placeholder="Upload your photo"
                        className='account-form_image-input hidden'
                        onChange={(e)=>handleChange(e,field.onChange)}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className=" text-base-semibold text-light-2">
                    Name
                </FormLabel>
                <FormControl className=' flex-1 text-base1-semibold text-gray-200'>
                    <Input 
                        type='text'
                        placeholder="Enter your name"
                        className='account-form_input no-focus'
                        {...field}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className=" text-base-semibold text-light-2">
                    Username
                </FormLabel>
                <FormControl className=' flex-1 text-base1-semibold text-gray-200'>
                    <Input 
                        type='text'
                        placeholder="Enter your Username"
                        className='account-form_input no-focus'
                        {...field}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
                <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className=" text-base-semibold text-light-2">
                    Bio
                </FormLabel>
                <FormControl className=' flex-1 text-base1-semibold text-gray-200'>
                    <Textarea 
                        rows={10}
                        placeholder="Enter your Bio"
                        className='account-form_input no-focus'
                        {...field}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>
            )}
            />
            <Button className=' bg-primary-500' type="submit">Update Profile</Button>
        </form>
        </Form>
    )
}