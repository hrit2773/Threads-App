import { fetchUser, fetchUserById } from "@/lib/actions/userActions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

const page=async ()=>{
    const user=await currentUser()
    if (!user) redirect('/sign-in');
    let currUser=await fetchUser(user.id)
    if (!currUser) redirect('/onboarding')
    let userInfo=await fetchUserById(currUser._id)
    userInfo=JSON.parse(JSON.stringify(userInfo))
    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                image={userInfo.image}
                bio={userInfo.bio}
            />
            <div className=" mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {
                            profileTabs.map((tab)=>(
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
                                        >{userInfo?.threads?.length}</p>
                                    ):(
                                        <p
                                            className=" ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2"
                                    >{userInfo?.threads?.filter((thread:any)=>{
                                        const textParts=thread.text.split(" ")
                                        return textParts.some((str:any) => str.includes('@'))
                                    }).length}</p> 
                                    )}
                                </TabsTrigger>

                            ))
                        }
                    </TabsList>
                    {profileTabs.map((tab)=>(

                        <TabsContent key={`content-${tab.label}`} value={tab.value} className=" w-full text-light-1">
                            {(tab.label==="Threads")?(
                                <ThreadsTab
                                currentUserId={userInfo._id.toString()}
                                accountId={currUser._id.toString()}
                                accountType="User"
                                threads={userInfo.threads}
                                />
                            ):(
                                <ThreadsTab
                                currentUserId={userInfo._id.toString()}
                                accountId={currUser._id.toString()}
                                accountType="User"
                                threads={userInfo.threads.filter((thread:any)=>{
                                    const textParts=thread.text.split(" ")
                                    return textParts.some((str:any) => str.includes('@'))
                                })}
                                />
                            )}

                        </TabsContent>
                    ))}
                    
                </Tabs>
            </div>
        </section>
    )
}
export default page