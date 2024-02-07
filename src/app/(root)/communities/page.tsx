import CommunityCard from "@/components/cards/CommmunityCard"
import UserCard from "@/components/cards/UserCard"
import SearchBar from "@/components/shared/SearchBar"
import { fetchCommunities } from "@/lib/actions/communityActions"
import { fetchUser, fetchUsers } from "@/lib/actions/userActions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Image from "next/image"

const page=async ({searchParams}:{searchParams:{search:string};})=>{
    const user=await currentUser()
    if (!user) redirect('/sign-in')
    const userInfo=await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect('/onboarding')
    let {communities,isNext}=await fetchCommunities({
        searchString:searchParams?.search || '',
        pageNumber:1,
        pageSize:25,
    })
    communities=JSON.parse(JSON.stringify(communities))

    return (
        <section>
            <SearchBar
                routeType="communities"
            />
            
            {(communities.length===0)?(
                    <div className=" mt-20 justify-center no-result flex flex-row gap-2">
                        <Image
                            src="/assets/icons8-nothing-found-24.png"
                            width={50}
                            height={50}
                            alt="icon"
                        />
                        <p className=" mt-3">No communities</p>
                    </div>
                ):(
                    <div className=" mt-14 flex flex-wrap gap-9">
                    {communities.map((community)=>(
                        <CommunityCard
                            key={community.id}
                            id={community.id}
                            username={community.username}
                            name={community.name}
                            imgUrl={community.image}
                            members={community.members}
                            bio={community.bio}
                        />
                    ))}
                    </div>
            )}
            
        </section>
    )
}
export default page