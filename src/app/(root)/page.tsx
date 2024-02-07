
import { fetchPosts } from "@/lib/actions/threadActions";
import { currentUser } from "@clerk/nextjs"; 
import { redirect } from "next/navigation";
import {ThreadCard} from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/userActions";

export default async function Home() {
  const user=await currentUser()
  if (!user) redirect('/sign-in')
  const userInfo=await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')
  
  let {posts,isNext}=await fetchPosts(1,30)
  posts=JSON.parse(JSON.stringify(posts))
  return (
    <>
    
    <section className=" mt-10 flex flex-col gap-10">
      {
        (posts.length===0)? (
          <p className="no-result">No Threads found</p>
        ):(
          <>
          {
            posts.map((post)=>(
              
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={userInfo._id.toString()}
                content={post.text}
                file={post.file}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                parentId={post.parentId}
                comments={post.children}
                isComment={false}
                likes={post.likes}
              />
            ))
          }
          </>
        )
      }
    </section>
    </>
  );
}
