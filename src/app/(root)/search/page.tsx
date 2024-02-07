import UserCard from "@/components/cards/UserCard"
import SearchBar from "@/components/shared/SearchBar"
import { fetchUser, fetchUsers } from "@/lib/actions/userActions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import { redirect } from "next/navigation"
import { ChangeEvent } from "react"


const page=async ({searchParams}:{searchParams:{search:string};})=>{
    const user=await currentUser()
    if (!user) redirect('/sign-in')
    const userInfo=await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect('/onboarding')
    let {users,isNext}=await fetchUsers({
        userId:user.id,
        searchString:searchParams?.search || '',
        pageNumber:1,
        pageSize:25,
    })
    let filteredUsers=JSON.parse(JSON.stringify(users))
    
    return (
        <section>
            
            <SearchBar
                routeType="search"
            />
            <div className=" mt-14 flex flex-col gap-9">
                {(filteredUsers.length===0)?(
                    <div className=" mt-20 justify-center no-result flex flex-row gap-2">
                        <Image
                            src="/assets/icons8-nothing-found-24.png"
                            width={50}
                            height={50}
                            alt="icon"
                        />
                        <p className=" mt-3">No users</p>
                    </div>
                ):(
                    <>
                    {filteredUsers.map((person:any)=>(
                        <UserCard
                            key={person.id}
                            id={person._id}
                            username={person.username}
                            name={person.name}
                            image={person.image}
                            personType="User"
                        />
                    ))}
                    </>
                )}
            </div>
        </section>
    )
}
export default page