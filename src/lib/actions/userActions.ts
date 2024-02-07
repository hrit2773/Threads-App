"use server";

import { connect } from "../mongoose";
import User from "../models/userModel";
import { revalidatePath } from "next/cache";
import Thread from "../models/threadModel";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/communityModels";

interface updateUserparams{
    id:string;
    username:string;
    name:string;
    image:string;
    bio:string;
    path:string;
}
interface fetchUsersParams{
    userId:string;
    searchString?:string;
    pageNumber?:number;
    pageSize?:number;
    sortBy?:SortOrder;
}

export const updateUser=async ({
    id,
    username,
    name,
    image,
    bio,
    path,
}:updateUserparams
    
):Promise<void> =>{
    try {
        connect()
        await User.findOneAndUpdate(
            {id:id},
            {
                username:username.toLowerCase(),
                name,
                image,
                onboarded:true,
                bio,
            },
            {upsert:true}
        )
        if (path==="/profile/edit"){
            revalidatePath(path)
        } 
    } catch (error:any) {
        throw new Error(`Failed to update the user ${error.message}`)
    }
    
} 

export const fetchUser=async (userId:string)=>{
    try {
        connect()
        return await User.findOne({id:userId})
    } catch (error:any) {
        throw new Error(`Failed to fetch user ${error.message}`)
    }
}
export const fetchUserById=async (Id:string)=>{
    
    try {
        connect()
        const user=await User.findById(Id)
                            .populate({
                                path:'communities',
                                model:Community,
                                select:'name image id'
                            })
                            .populate({
                                path:'threads',
                                model:Thread,
                                populate:[
                                    
                                    {
                                        path:'author',
                                        model:User,
                                        select:"name image id _id"
                                    },
                                    {
                                        path:'community',
                                        model:Community,
                                        select:"name image id"
                                    },
                                    {
                                        path:'children',
                                        model:Thread,
                                        populate:{
                                            path:'author',
                                            model:User,
                                            select:"name image id _id"
                                        },
                                        select:'author'    
                                    }
                                ],
                                select:"_id parentId text author file community createdAt children likes"

                            })
        return user
    } catch (error:any) {
        throw new Error(`Failed to fetch user ${error.message}`)
    }
}

export const fetchUsers=async ({
    userId,
    searchString="",
    pageNumber=1,
    pageSize=20,
    sortBy="desc"
}:fetchUsersParams)=>{
    try {
        connect()
        const skipAmount=(pageNumber-1)*pageSize
        const regex=new RegExp(searchString,"i")
        const query:FilterQuery<typeof User>={
            id:{$ne:userId}
        }
        if (searchString.trim() !== ""){
            query.$or=[
                {username:{$regex:regex}},
                {name:{$regex:regex}}
            ]
        }
        const usersQuery=User.find(query)
                            .sort({username:sortBy,name:sortBy})
                            .skip(skipAmount)
                            .limit(pageSize)
                            .populate({
                                path:'communities',
                                model:Community,
                                select:"name image id"
                            })
        const totalUsersCount=await User.countDocuments(query)
        const users=await usersQuery.exec()
        const isNext=totalUsersCount>skipAmount+users.length
        return {users,isNext}
    } catch (error:any) {
        throw new Error(`Failed to fetch users ${error.message}`)
    }
}

export const getActivity=async (userId:string)=>{
    try {
       connect() 
       const userThreads=await Thread.find({author:userId})
       const childrenThreadIds:string[]=userThreads.reduce((acc,userThread)=>{
           return acc.concat(userThread.children)
       },[])

       const replies=await Thread.find({
        _id:{$in:childrenThreadIds},
        author:{$ne:userId}
       })
        .sort({createdAt:-1})
        .populate({
            path:'author',
            model:User,
            select:"name username image _id"
        })

       return replies
    } catch (error:any) {
        throw new Error(`Failed to get the activity ${error.message}`)
    }
    
}

export const fetchAllUsers=async ()=>{
    try {
        const users=await User.find()
        return users
    } catch (error:any) {
        throw new Error(`Failed to fetch all users ${error.message}`)
    }
}