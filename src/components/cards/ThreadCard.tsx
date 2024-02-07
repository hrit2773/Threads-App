"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef,useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { formatDateString } from "@/lib/utils";
import { addLike,createThread,removeLike } from "@/lib/actions/threadActions";
import { useOrganization } from "@clerk/nextjs";
import HeartGif from "../shared/HeartGif";


interface Props{
    id:string;
    currentUserId:string;
    content:string;
    file:string;
    author:{
        name:string;
        image:string;
        _id:string;
    };
    community:{
        name:string;
        image:string;
        id:string;
    } | null;
    createdAt:string;
    parentId:string | undefined | null;
    comments:{
        author:{
            _id:string;
            image:string;
            name:string;
        }
    }[];
    isComment?:boolean;
    likes:string[];
}

export const ThreadCard=({
    id,
    currentUserId,
    file,
    content,
    author,
    community,
    createdAt,
    parentId,
    comments,
    isComment,
    likes
}:Props
)=>{
    const [isPending,startTransition]=useTransition()
    const pathname=usePathname()
    let videoRef=useRef<HTMLVideoElement>(null)
    const {organization}=useOrganization()
    
    const PostContent = () => {
        // Regular expression to match @username mentions
        const mentionRegex = /@(\w+)/g;
      
        // Use matchAll to capture all matches including the capturing group
        const matches = content.matchAll(mentionRegex);
      
        // Iterate through matches and create an array of parts
        const parts = [];
        let lastIndex = 0;
      
        for (const match of matches) {
          const username = match[1] ?? ''; // Use an empty string as a default value
          const matchIndex = match.index ?? 0; // Use 0 as a default value
      
          // Regular text before the match
          parts.push(content.substring(lastIndex, matchIndex));
      
          // Mentioned username with different styling
          parts.push(
            <span key={matchIndex} className=" text-primary-500">
              @{username}
            </span>
          );
      
          lastIndex = matchIndex + (match[0]?.length ?? 0); // Use 0 as a default value
        }
      
        // Regular text after the last match
        parts.push(content.substring(lastIndex));
      
        return <div className="">{parts}</div>;
    };
    
    const likeInc=async ()=>{
        startTransition(async ()=>{
            await addLike(id,currentUserId,pathname)
        })
    }
    const likeDec=async ()=>{
        startTransition(async ()=>{
            await removeLike(id,currentUserId,pathname)
        })
    }

    const Repost=async ()=>{
        await createThread({
            text:content,
            author:currentUserId,
            file:file,
            communityId:((organization && organization.id===community?.id)||(!community && organization))? organization.id : null,
            path:pathname
        })
    }
    useEffect(() => {
        
        const video = videoRef.current;
    
        const pauseVideoOnScroll = () => {
          if (video && isElementInViewport(video)) {
            video?.play();
            
          } else {
            video?.pause();
          }
        };
    
        const isElementInViewport = (el: HTMLVideoElement) => {
          const rect = el.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
          );
        };
    
        window.addEventListener('scroll', pauseVideoOnScroll);
    
        pauseVideoOnScroll();
    
        return () => {
          window.removeEventListener('scroll', pauseVideoOnScroll);
        };
    }, []);
    

    let ref=useRef<HTMLVideoElement>(null)
    return (
        <article onScroll={(e)=>{
            ref.current?.pause()
        }} className={`flex w-full flex-col rounded-xl ${(isComment)? 'px-0 xs:px-7':'bg-dark-2 p-7'}`}>
            <div className=" flex flex-1 items-start justify-between">
                <div className="flex flex-row gap-4 w-full">
                    <div className="flex flex-col items-center">
                        {
                            (!pathname.includes('profile'))?(
                                <Link href={`/profile/${author._id}`} className=" relative h-11 w-11">
                                    <Image
                                        src={author.image}
                                        fill
                                        alt="profile pic"
                                        className=" cursor-pointer rounded-full"
                                    />
                                </Link>
                            ):(
                                <div className=" relative h-11 w-11">
                                    <Image
                                        src={author.image}
                                        fill
                                        alt="profile pic"
                                        className=" rounded-full"
                                    />
                                </div>
                            )
                        }
                        
                        <div className="thread-card_bar"/>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <Link href={`/profile/${author._id}`} className={`${(isComment)? "flex flex-col":""} w-fit`}>
                            <h4 className=" cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                            {isComment &&(
                                <p className=" text-subtle-medium text-gray-1">
                                    @{formatDateString(createdAt)}
                                </p>
                            )}
                        </Link>
                        <div className="mt-3 text-small-regular text-light-2">{PostContent()}</div>
                        {
                            (file!==undefined && file!=='' && (file.includes('jpg') || file.includes('png') || file.includes('image')))? (
                                <div className="relative h-96 w-96">
                                    <Image
                                        src={file}
                                        alt="file"
                                        fill
                                        className="rounded-lg border border-gray-400"
                                    />

                                </div>
                            ):(
                                <div>
                                    {
                                        (file !==undefined && file.includes('video'))? (
                                            <video
                                                ref={videoRef}
                                                src={file}
                                                width={600}
                                                height={600}
                                                muted={true}
                                                controls={true}
                                                loop={true}
                                                className="rounded-lg border border-gray-400"
                                                        
                                            />
                                                
                                            
                                        ):(<></>)
                                    }
                                </div>
                            )
                        }
                        <div className="flex flex-col gap-3 mt-5">
                            <div className="flex gap-5">
                                <div>
                                    {(isPending)? (<HeartGif/>):(
                                        <div>
                                            {(likes.includes(currentUserId))? (
                                                <Image
                                                    src="/assets/heart-filled.svg"
                                                    width={30}
                                                    height={30}
                                                    alt="heart icon"
                                                    className=" cursor-pointer object-contain"
                                                    onClick={likeDec}
                                                />
                                            ):(
                                                <Image
                                                    src="/assets/heart-gray.svg"
                                                    width={30}
                                                    height={30}
                                                    alt="heart icon"
                                                    className=" cursor-pointer object-contain"
                                                    onClick={likeInc}
                                                />
                                            )}
                                        </div>
                                    )}

                                </div>
                                <Link href={`/thread/${id}`}>
                                    <Image
                                        src="/assets/reply.svg"
                                        width={30}
                                        height={30}
                                        alt="heart icon"
                                        className=" cursor-pointer object-contain"
                                    />
                                </Link>
                                {(!isComment && !parentId )? (
                                    <>
                                    <Image
                                        src="/assets/repost.svg"
                                        width={30}
                                        height={30}
                                        alt="heart icon"
                                        className=" cursor-pointer object-contain"
                                        onClick={Repost}
                                    />
                                    
                                    </>
                                ):(
                                    <></>
                                )}
                                
                            </div>
                            <div className={`${(isComment)? "-mt-2":""} flex flex-row gap-2`}>
                                {
                                    (((!pathname.includes('thread') && !isComment) || isComment)  &&  comments.length>0) && (
                                        <Link href={`/thread/${id}`} className="flex flex-row mt-2">
                                            {comments.slice(0,3).map((comment)=>(
                                                <Image
                                                    key={comment.author._id}
                                                    src={comment.author.image}
                                                    alt="profile"
                                                    width={20}
                                                    height={20}
                                                    className=" -ml-1 rounded-full object-cover"
                                                />
                                            ))}
                                            <p
                                            className=" ml-2 text-subtle-medium mt-1 text-gray-1"
                                            >{comments.length} {(comments.length>1)? (<span>replies</span>):(<span>reply</span>) } </p>
                                        </Link>
                                    )
                                }
                                {(likes.length===0)?(
                                <>
                                </>):(
                                    <p className=" text-gray-1 mt-3 text-subtle-medium">
                                        {likes.length} {(likes.length>1)?(<span>likes</span>):(<span>like</span>)}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                    </div>
                </div>
                {/*Show delete thread */}
                {/*show comment logos */}
            </div>
            {!isComment &&(
                <div className="mt-5 flex items-center">
                    <p className=" text-subtle-medium text-gray-1">
                        {formatDateString(createdAt)}  {community &&(<span>- {community.name} Community</span>)}
                    </p>
                    {community &&(
                        <Link href={`/communities/${community.id}`} className="ml-1 relative h-8 w-8">
                            <Image
                            src={community.image}
                            alt={community.name}
                            fill
                            className=" rounded-full object-cover"
                            />
                        </Link>
                    )}
                </div>
            )}
            
        </article>
    )
}