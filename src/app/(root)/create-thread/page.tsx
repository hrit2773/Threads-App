import { fetchUser } from "@/lib/actions/userActions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import PostThread from "@/components/forms/PostThread";

async function Page(){
    const user=await currentUser()
    if (!user) return null;
    const userInfo=await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect('/onboarding')

    return(
        <>
            
            <PostThread userId={userInfo._id.toString()} />
        </>
    )
}
export default Page