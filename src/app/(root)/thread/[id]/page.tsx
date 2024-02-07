import { fetchUser } from "@/lib/actions/userActions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ThreadCard } from "@/components/cards/ThreadCard";
import { fetchThreadById } from "@/lib/actions/threadActions";
import Comment from "@/components/forms/Comment";

const page=async ({params}:{params:{id:string;}})=>{
    if (!params.id) return null;
    const user=await currentUser()
    if (!user) return null;
    const userInfo=await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect('/onboarding');
    let thread=await fetchThreadById(params.id)
    thread=JSON.parse(JSON.stringify(thread))

    return(
        <section className="relative">
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={userInfo._id.toString()}
                    content={thread.text}
                    file={thread.file}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    parentId={thread.parentId}
                    comments={thread.children}
                    isComment={false}
                    likes={thread.likes}
                />
            </div>
            <div className=" mt-7">
                <Comment
                    threadId={thread._id.toString()}
                    currentUserImg={userInfo.image}
                    currentUserId={userInfo._id.toString()}
                />
            </div>
            <div className=" mt-10">
                {
                    thread.children.map((comment:any)=>(
                        <div key={comment._id} className=" mt-7">
                        <ThreadCard
                            
                            id={comment._id}
                            currentUserId={userInfo._id.toString()}
                            content={comment.text}
                            file={comment.file}
                            author={comment.author}
                            community={comment.community}
                            createdAt={comment.createdAt}
                            parentId={comment.parentId}
                            comments={comment.children}
                            isComment={true}
                            likes={comment.likes}
                        />
                        </div>
                    ))
                }
            </div>
        </section>
    )
}
export default page