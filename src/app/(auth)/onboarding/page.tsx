import AccountProfile from "@/components/forms/AccountProfile"
import { fetchUser } from "@/lib/actions/userActions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function Onboarding() {
    const user=await currentUser()
    if (!user) redirect('/sign-in')
    let userInfo=await fetchUser(user.id)
    userInfo=JSON.parse(JSON.stringify(userInfo))
    if (userInfo && userInfo.onboarded===true) redirect('/')
    const userData={
        id:user?.id,
        objectID:userInfo?._id || null ,
        username:userInfo?.username || user?.username,
        name:userInfo?.name || user?.firstName,
        bio:userInfo?.bio || "",
        image:userInfo?.image || user?.imageUrl,
    }

    return (
        <main className=" mx-auto flex flex-col justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className=" text-light-2 text-base-regular">
                Complete your profile now to use Threads
            </p>
            <section className="bg-dark-2 mt-9 p-10">
                <AccountProfile 
                user={userData} 
                btnTitle="continue" 
                />
            </section>
        </main>
    )
}