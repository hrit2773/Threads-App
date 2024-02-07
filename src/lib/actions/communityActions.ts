import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/communityModels"
import Thread from "../models/threadModel"
import User from "../models/userModel"
import { connect } from "../mongoose"
import { revalidatePath } from "next/cache";

interface fetchCommunitiesParams{
    searchString?:string;
    pageNumber?:number;
    pageSize?:number;
    sortBy?:SortOrder;
}
export const createCommunity=async (
    id:string,
    name:string,
    username:string,
    image:string,
    bio:string,
    createdBy:string
)=>{
    try {
        connect()
        const user=await User.findOne({id:createdBy})
        if (!user){
            throw new Error("User not found")
        }
        
        const communityData=new Community({
            id,
            name,
            username,
            image,
            bio,
            createdBy:user._id
        })
        const community=await communityData.save()
        
        if (user.communities.includes(community._id)) {
            throw new Error("User already exists")
        }
        user.communities.push(community._id)
        await user.save()
        
        return community

    } catch (error:any) {
        throw new Error(`Failed to create a community ${error.message}`)
    }
}

export const addMemberToCommunity=async (communityId:string,memberId:string)=>{
    try {
        connect()
        const community=await Community.findOne({id:communityId})
        if (!community){
            throw new Error("Community not found")
        }
        const user=await User.findOne({id:memberId})
        if (!user){
            throw new Error("User not found")
        }
        if (community.members.includes(user._id)){
            throw new Error("User is already in the community")
        }
        user.communities.push(community._id)
        await user.save()
        community.members.push(user._id)
        await community.save()
        return community

    } catch (error:any) {
        throw new Error(`Failed to add a member to the community ${error.message}`)
    }

}

export const removeUserFromCommunity=async (userId:string,communityId:string)=>{
    try {
        connect()
        const community=await Community.findOne({id:communityId})
        if (!community){
            throw new Error("Community not found")
        }
        const user=await User.findOne({id:userId})
        if (!user){
            throw new Error("User not found")
        }
        if (!community.members.includes(user._id)){
            throw new Error("User is not in the community")
        }
        await User.updateOne(
            {_id:user._id},
            {$pull:{communities:community._id}}
        )
        await Community.updateOne(
            {_id:community._id},
            {$pull:{members:user._id}}
        )
        return {success:true}  
    } catch (error:any) {
        throw new Error(`Failed to remove user from the community ${error.message}`)
    }
}

export const updateCommunityInfo=async (
    id:string,
    name:string,
    username:string,
    image:string
)=>{
    try {
        const updatedCommunity=Community.findOneAndUpdate(
            {id:id},
            {name,username,image}
        )
        if (!updatedCommunity){
            throw new Error("Community not found")
        }
        return updatedCommunity
    } catch (error:any) {
        throw new Error(`Failed to update the community info ${error.message}`)
    }
}
export const deleteCommunity=async (id:string)=>{
    try {
        connect()
        const deletedCommunity=await Community.findOneAndDelete({id:id})
        if (!deletedCommunity){
            throw new Error("Community not found")
        }
        await Thread.deleteMany({community:deletedCommunity._id})
        const communityUsers=await User.find({communities:deletedCommunity._id})
        const updatedCommunityUsers=communityUsers.map((user)=>{
            user.communities.pull(deletedCommunity._id)
            return user.save()
        })
        await Promise.all(updatedCommunityUsers)
        revalidatePath
        return deletedCommunity
    } catch (error:any) {
        throw new Error(`Failed to delete the community ${error.message}`)
    }
}
export const fetchCommunityDetails=async (id:string)=>{
    try {
        connect()
        const community=await Community.findOne({id:id})
                                        .populate([
                                            {
                                                path:'createdBy',
                                                model:User,
                                                select:"name username image id _id"
                                            },
                                            {
                                                path:'members',
                                                model:User,
                                                select:"name username image id _id"
                                            },
                                            {
                                                path:'threads',
                                                model:Thread,
                                                populate:[
                                                    {
                                                        path:'author',
                                                        model:User,
                                                        select:"name image _id  id"
                                                    },
                                                    {
                                                        path:'children',
                                                        model:Thread,
                                                        select:"name image _id"
                                                    },
                                                    {
                                                        path:'community',
                                                        model:Community,
                                                        select:"name image id"
                                                    }
                                                ]
                                            }
                                        ])
        return community
    } catch (error:any) {
        throw new Error(`Failed to get the community details ${error.message}`)
    }
}

export const fetchCommunities=async ({
        searchString="",
        pageNumber=1,
        pageSize=20,
        sortBy="desc"
}:fetchCommunitiesParams)=>{
    try {
        connect()
        const skipAmount=(pageNumber-1)*pageSize
        const regex=new RegExp(searchString,"i")
        const query:FilterQuery<typeof Community>={}
        if (searchString.trim() !== ""){
            query.$or=[
                {username:{$regex:regex}},
                {name:{$regex:regex}}
            ]
        }
        const communitiesQuery=Community.find(query)
                            .sort({username:sortBy,name:sortBy})
                            .skip(skipAmount)
                            .limit(pageSize)
                            .populate({
                                path:'members',
                                model:User,
                                select:"name image id"
                            })
        const totalCommunitiesCount=await Community.countDocuments(query)
        const communities=await communitiesQuery.exec()
        const isNext=totalCommunitiesCount>skipAmount+communities.length
        return {communities,isNext}
    } catch (error:any) {
        throw new Error(`Failed to fetch users ${error.message}`)
    }
}
export const fetchAllCommunities=async ()=>{
    try {
        const communities=await Community.find()
        return communities
    } catch (error:any) {
        throw new Error(`Failed to fetch all communities ${error.message}`)
    }
}