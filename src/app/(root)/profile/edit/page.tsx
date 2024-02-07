import AccountProfile from "@/components/forms/AccountProfile"
import { fetchUser } from "@/lib/actions/userActions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const page=async ()=>{
    const user=await currentUser()
    if (!user) redirect('/sign-in')
    let userInfo=await fetchUser(user.id)
    userInfo=JSON.parse(JSON.stringify(userInfo))
    if (!userInfo.onboarded) redirect('/onboarding')
    const userData={
        id:user?.id,
        objectID:userInfo?._id || null ,
        username:userInfo?.username || user?.username,
        name:userInfo?.name || user?.firstName,
        bio:userInfo?.bio || "",
        image:userInfo?.image || user?.imageUrl,
    }
    return(
        <section className=" m-12">
            <AccountProfile 
                user={userData} 
                btnTitle="continue" 
            />
        </section>
    )
}
export default page