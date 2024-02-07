import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { Inter } from "next/font/google";
import '../globals.css'


export const metadata={
    title:'Threads',
    description:'A meta threads application'
}
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children
}:{
    children:React.ReactNode
}) {
    return(
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="flex w-full min-h-screen items-center justify-center">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>

    )

}
