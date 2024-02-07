"use client";
import Image from "next/image";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({routeType}:{routeType:string;}){
    let [searchString,setSearchString]=useState('')
    const router=useRouter()
    useEffect(()=>{
        setTimeout(()=>{
            if (searchString!==''){
                router.push(`/${routeType}?search=${searchString}`)   
            }
            else{
                router.push(`/${routeType}`)
            }
        },300)
    },[searchString])
    return(
        <div className="searchbar">
            <Image
                src="/assets/search-gray.svg"
                alt="search icon"
                width={28}
                height={28}
            />
            <Input
                value={searchString}
                placeholder= {`Search ${(routeType==="search")? "users":"communities"}`}
                type="text"
                className="no-focus searchbar_input"
                onChange={(e)=>setSearchString(e.target.value)}
            />
        </div>
    )
}