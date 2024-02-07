import { fetchAllCommunities } from "@/lib/actions/communityActions"
import { fetchAllUsers } from "@/lib/actions/userActions"
import Image from "next/image"
import UserCard from "../cards/UserCard"
import { currentUser } from "@clerk/nextjs"

export default async function Rightbar(){
    let currUser=await currentUser()
    let communities=await fetchAllCommunities()
    let users=await fetchAllUsers()
    communities=JSON.parse(JSON.stringify(communities))
    users=JSON.parse(JSON.stringify(users))
    return (
        <section className="custom-scrollbar rightsidebar">
            <div className="flex flex-1 flex-col justify-evenly">
                <h3 className="text-light-1 text-heading4-medium">Suggested communities</h3>
                {(!communities)?(
                    <div className=" mt-7 justify-center no-result flex flex-row gap-2">
                    <Image
                        src="/assets/icons8-nothing-found-24.png"
                        width={50}
                        height={50}
                        alt="icon"
                    />
                    <p className=" mt-3">No suggestions</p>
                    </div>
                ):(
                    <div>
                        {communities.slice().sort(()=>Math.random()-0.5).slice(0,3).map((community)=>(
                            <div key={community.id} className=" flex flex-col justify-evenly mt-8">
                                <UserCard
                                    
                                    id={community.id}
                                    username={community.username}
                                    name={community.name}
                                    image={community.image}
                                    personType="Community"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-light-1 text-heading4-medium">Suggested Users</h3>
                {(!users)?(
                    <div className=" mt-7 justify-center no-result flex flex-row gap-2">
                    <Image
                        src="/assets/icons8-nothing-found-24.png"
                        width={50}
                        height={50}
                        alt="icon"
                    />
                    <p className=" mt-3">No suggestions</p>
                    </div>
                ):(
                    <div>
                        {users.slice().sort(()=>Math.random()-0.5).filter((user)=>user.id!==currUser?.id).slice(0,3).map((user)=>(
                            <div key={user._id} className=" flex flex-col justify-evenly mt-8">
                                <UserCard
                                    id={user._id}
                                    username={user.username}
                                    name={user.name}
                                    image={user.image}
                                    personType="User"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}