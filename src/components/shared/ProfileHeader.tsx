import Image from "next/image";
import Link from "next/link";

interface Props{
    accountId:string;
    authUserId:string;
    name:string;
    username:string;
    image:string;
    bio:string;
    type? :'User' | 'Community';
}

export default function ProfileHeader({
    accountId,
    authUserId,
    name,
    username,
    image,
    bio,
    type
}:Props){
    return(
        <div className="flex w-full flex-col justify-start gap-6">
            
            <div className=" flex items-center gap-3">
                {(accountId===authUserId)? (
                    <Link href="/profile/edit">
                        <Image
                            src={image}
                            alt="user"
                            width={80}
                            height={80}
                            className=" rounded-full"
                        />
                    </Link>
                ):(
                    <Image
                        src={image}
                        alt="user"
                        width={80}
                        height={80}
                        className=" rounded-full"
                    />
                )}
                <div className="flex flex-col items-center">
                    <div className=" text-heading3-bold text-light-1">
                        {name}
                    </div>
                    <div className=" px-0 text-base-medium text-gray-1">
                        @{username}
                    </div>
                </div>
            </div>
            <div className=" max-w-lg text-base-semibold text-light-2">
                {bio}
            </div>
        </div>
    )
}