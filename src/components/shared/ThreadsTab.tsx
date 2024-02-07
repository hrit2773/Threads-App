import { ThreadCard } from "../cards/ThreadCard";
import Image from "next/image";
interface Props{
    currentUserId:string;
    accountId:string;
    accountType:string;
    threads:{
        _id:string;
        parentId:string|undefined|null;
        text:string;
        author:{
            name:string;
            image:string;
            _id:string;
            id:string;
        }; 
        file:string; 
        community:{
            name:string;
            image:string;
            id:string;
        } | null; 
        createdAt:string; 
        children:{
            author:{
                _id:string;
                id:string;
                image:string;
                name:string;
                
            }
        }[],
        likes:string[]
    }[]
}
export default function ThreadsTab({
    currentUserId,
    accountId,
    accountType,
    threads
}:Props){
    if (threads?.length===0){
        return (

            <div className=" mt-20 justify-center no-result flex flex-row gap-2">
                <Image
                    src="/assets/icons8-nothing-found-24.png"
                    width={50}
                    height={50}
                    alt="icon"
                />
                <p className=" mt-3">No threads found</p>
            </div>
        )
    }
    return (
        <section className="mt-9 flex flex-col gap-10">
            {threads.map((thread)=>(
                
                <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={currentUserId}
                content={thread.text}
                file={thread.file}
                author={thread.author}//Todo
                community={thread.community}//Todo
                createdAt={thread.createdAt}
                parentId={thread.parentId}
                comments={thread.children}
                likes={thread.likes}
                isComment={false}
              />
                
            ))}
        </section>
    )
}