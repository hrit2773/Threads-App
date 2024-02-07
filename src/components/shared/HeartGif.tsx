import Image from "next/image";

export default function HeartGif(){
    return(
        <Image
            src="/Beating_Heart.gif"
            alt="icon"
            width={30}
            height={30}
            className="rounded-full object-fit"
        />
    )
}