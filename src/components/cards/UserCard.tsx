"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
interface userCardProps{
    id:string;
    username:string;
    name:string;
    image:string;
    personType:string;
}

export default function UserCard({
    id,
    username,
    name,
    image,
    personType
}:userCardProps){
    const router=useRouter()
    return(
        <article className="user-card">
            <div className="user-card_avatar">
                <Image
                    src={image}
                    alt="logo"
                    width={48}
                    height={48}
                    className=" rounded-full"
                />
                <div className="flex-1 text-ellipsis">
                    <h4 className=" text-base-semibold text-light-1">{name}</h4>
                    <p className=" text-small-medium text-gray-1">@{username}</p>
                </div>
            </div>
            <Button className="user-card_btn" onClick={()=>{
                if (personType==="User"){
                    router.push(`/profile/${id}`)
                }
                else{
                    router.push(`/communities/${id}`)
                }
            }}>
                View
            </Button>
        </article>
    )
}