import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { communityTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { fetchCommunityDetails } from "@/lib/actions/communityActions";
import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUserById } from "@/lib/actions/userActions";

const page=async ({params}:{params:{id:string;}})=>{
    const user=await currentUser()
    if (!user) redirect('/sign-in');
    let userInfo=await fetchUser(user.id)
    userInfo=JSON.parse(JSON.stringify(userInfo))
    let community=await fetchCommunityDetails(params.id)
    community=JSON.parse(JSON.stringify(community))

    return (
        <section>
            <ProfileHeader
                accountId={community.id}
                authUserId={user.id}
                name={community.name}
                username={community.username}
                image={community.image}
                bio={community.bio}
                type="Community"
            />
            <div className=" mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {
                            communityTabs.map((tab)=>(
                                <TabsTrigger key={tab.label} className="tab" value={tab.value}>
                                    <Image
                                        src={tab.icon}
                                        width={24}
                                        height={24}
                                        alt="icon"
                                        className=" object-contain"
                                    />
                                    <p className=" max-sm:hidden">{tab.label}</p>
                                    {(tab.label==="Threads")? (
                                        <p
                                            className=" ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2"
                                        >{community?.threads?.length}</p>
                                    ):(
                                        <p
                                            className=" ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2"
                                        >{community?.members?.length}</p>
                                    )}
                                </TabsTrigger>

                            ))
                        }
                    </TabsList>
                    
                    <TabsContent value="threads" className=" w-full text-light-1">
                        <ThreadsTab
                            currentUserId={userInfo._id}
                            accountId={community.id}
                            accountType="Community"
                            threads={community.threads}
                        />

                    </TabsContent>
                    <TabsContent value="members" className=" w-full text-light-1">
                        {(community?.members.length===0)?(
                            <div className=" mt-20 justify-center no-result flex flex-row gap-2">
                            <Image
                                src="/assets/icons8-nothing-found-24.png"
                                width={50}
                                height={50}
                                alt="icon"
                            />
                            <p className=" mt-3">No members yet</p>
                        </div>
                        ):(
                            <section className=" mt-9 flex flex-col gap-10">
                                {community.members.map((member:any)=>(
                                    <UserCard
                                        key={member.id}
                                        id={member._id}
                                        username={member.username}
                                        name={member.name}
                                        image={member.image}
                                        personType="User"
                                    />
                                ))}
                            </section>
                        )}
                    </TabsContent>
                    
                    
                </Tabs>
            </div>
        </section>
    )
}
export default page