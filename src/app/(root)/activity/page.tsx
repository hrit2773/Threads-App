import Image from "next/image"
import { fetchUser,getActivity } from "@/lib/actions/userActions"
import { currentUser } from "@clerk/nextjs"
import Link from "next/link"
import { redirect } from "next/navigation"

const page=async ()=>{
    const user=await currentUser()
    if (!user) redirect('/sign-in')
    const userInfo=await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect('/onboarding')
    let activity=await getActivity(userInfo._id)
    activity=JSON.parse(JSON.stringify(activity))

    return (
        <section>
            
            <section className="mt-10 flex flex-col gap-5">
                {(activity.length===0)?(
                    <div className=" h-96 justify-center items-center no-result flex flex-row gap-2">
                    <Image
                        src="/assets/icons8-nothing-found-24.png"
                        width={50}
                        height={50}
                        alt="icon"
                    />
                    <p className=" mt-3">No activities yet</p>
                    </div>
                ):(
                    <>
                    {activity.map((activity)=>(
                        <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                            <article className="activity-card">
                                <Image
                                    src={activity.author.image}
                                    alt="profile pic"
                                    height={20}
                                    width={20}
                                    className="rounded-full object-cover"
                                />
                                <p className="!text-small-regular text-light-1">
                                    <span className=" text-primary-500">
                                        @{activity.author.username}
                                    </span>{" "}
                                    replied to your thread
                                </p>
                            </article>
                        </Link>
                    ))}
                    </>
                )}
            </section>
        </section>
    )
}
export default page