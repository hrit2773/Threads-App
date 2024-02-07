"use server";
import { connect } from "../mongoose";
import Thread from "../models/threadModel";
import User from "../models/userModel";
import { revalidatePath } from "next/cache";
import Community from "../models/communityModels";

interface threadProps{
    text:string;
    author:string;
    file:string;
    communityId:string | null;
    path:string;
}

interface commentProps{
    threadId:string;
    commentText:string;
    userId:string;
    path:string;
}

export const createThread=async ({text,author,file,communityId,path}:threadProps):Promise<void>=>{
    connect()
    try {
        const community=await Community.findOne({id:communityId})
        const thread=await Thread.create({
            text,
            author,
            file,
            community: community? community._id:null,
        })
        if (community){
            community.threads.push(thread._id)
            await community.save()
        }
        await User.findByIdAndUpdate(author,{
            $push:{threads:thread._id}
        })
        revalidatePath(path)
    } catch (error:any) {
        throw new Error(`Failed to create thread ${error.message}`)
    }
    
}

export const fetchPosts= async (pageNumber=1,pageSize=20)=>{
    connect()
    try {
        const skipAmount=(pageNumber-1)*pageSize
        const currentPagePosts=Thread.find({parentId:{$in:[null,undefined]}})
                                    .sort({createdAt:'desc'})
                                    .skip(skipAmount)
                                    .limit(pageSize)
                                    .populate({
                                        path:'author',
                                        model:User,
                                        select:"_id name image"
                                    })
                                    .populate({
                                        path:'community',
                                        model:Community,
                                        select:"name image id"
                                    })
                                    .populate({
                                        path:'children',
                                        model:Thread,
                                        populate:{
                                            path:'author',
                                            model:User,
                                            select:"_id name image"
                                        },
                                        select:"author"
                                    })
        const totalPostsCount=await Thread.countDocuments({parentId:{$in:[null,undefined]}})
        const posts=await currentPagePosts.exec()
        const isNext= totalPostsCount>(skipAmount+posts.length)
        return {posts,isNext}
        
    } catch (error:any) {
        throw new Error(`Failed to fetch the threads ${error.message}`)
    }
}

export const fetchThreadById=async (id:string)=>{
    connect()
    try {
        const thread=await Thread.findById(id)
                                .populate({
                                    path:'author',
                                    model:User,
                                    select:"_id id name image",  
                                })
                                .populate({
                                    path:'community',
                                    model:Community,
                                    select:"name image id"
                                })
                                .populate({
                                    path:'children',
                                    populate:[
                                        {
                                            path:'author',
                                            model:'User',
                                            select:"_id id name image"
                                        },
                                        {
                                            path:'children',
                                            model:'Thread',
                                            populate:{
                                                path:'author',
                                                model:'User',
                                                select:"_id id name image"
                                            }
                                        }
                                    ]
                                }).exec()
        return thread
    } catch (error:any) {
        throw new Error(`Error fetching the thread and its comments ${error.message}`)
    }
}

export const addCommentToThread=async ({
    threadId,
    commentText,
    userId,
    path
}:commentProps)=>{
    connect()
    try {
        const originalThread=await Thread.findById(threadId)
        if (!originalThread){
            throw new Error("Thread not found")
        }
        const commentThread=await Thread.create({
            text:commentText,
            author:userId,
            parentId:threadId
        })
        originalThread.children.push(commentThread._id)
        await originalThread.save()
        revalidatePath(path)

    } catch (error:any) {
        throw new Error(`Failed to add a comment ${error.message}`)
    }

}

export const addLike=async (threadId:string,userId:string,path:string)=>{
    try {
        connect()
        await Thread.updateOne(
            {_id:threadId},
            {$push:{likes:userId}}
        )
        revalidatePath(path)
    } catch (error:any) {
        throw new Error(`Failed to add a like ${error.message}`)
    }
}

export const removeLike=async (threadId:string,userId:string,path:string)=>{
    try {
        connect()
        await Thread.updateOne(
            {_id:threadId},
            {$pull:{likes:userId}}
        )
        revalidatePath(path)
    } catch (error:any) {
        throw new Error(`Failed to remove a like ${error.message}`)
    }
}