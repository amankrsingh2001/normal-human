import { exchangeCodeForAccessToken, getAccountDetail } from "@/lib/aurinko";
import {waitUntil} from "@vercel/functions"
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const GET = async(req:NextRequest)=>{
    const {userId} = await auth()
    if(!userId) return NextResponse.json({message:"Unauthoried"},{status:401})

        const params = req.nextUrl.searchParams

        const status = params.get('status')
        if(!status) return NextResponse.json({message:"falied to link account"},{status:400})
            
            //get code for the exchange of access token
        const code = params.get('code')  
        
        if(!code) return NextResponse.json({message:"No code provided"},{status:400})  

            const token = await exchangeCodeForAccessToken(code)
         

            if(!token) return NextResponse.json({message:"Failed to exchange code for access token"},{status:400})

                const accountDetails = await getAccountDetail(token.accessToken)

                await db.account.upsert({
                    where:  {
                        id: token.accountId.toString()
                    },
                    update: {
                        accessToken:token.accessToken
                    },
                    create: {
                        id:token.accountId.toString(),
                        userId,
                        emailAddress:accountDetails.email,
                        name:accountDetails.name,
                        accessToken:token.accessToken
                    }
                })

                waitUntil(
                    axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`,{
                        accountId:token.accountId.toString(),
                        userId
                    }).then(response =>{
                        console.log("Initial sync triggered", response.data)
                    }).catch(error=>{
                        console.log("Failed to trigger initial sync", error)
                    })
                )
    return NextResponse.redirect(new URL('/mail', req.url))
}