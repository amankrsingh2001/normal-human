//initial-sync

import { Account } from "@/lib/account";
import { syncEmailToDatabase } from "@/lib/sync-to-db";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest)=>{
    const {accountId, userId} = await req.json()
    if(!accountId|| !userId) {
        return NextResponse.json({error:"Missing accountId or userId"},{status:400})
    }

    const dbAccount = await db.account.findUnique({
        where:{
            id:accountId,
            userId
        }
    })
    if(!dbAccount) return NextResponse.json({error:"Account not found"}, {status:404})
        const account = new Account(dbAccount.accessToken)
        const response = await account.performInitailsync()
        if(!response){
            return NextResponse.json({error:"Failed to perform inital sync"},{status:500})
        }
        const {emails, deltaToken} = response
        
        console.log(emails,"This is the emails")
        await db.account.update({
            where:{
                id:accountId
            },
            data:{
                nextDeltaToken:deltaToken
            }
        })
        await syncEmailToDatabase(emails, accountId)
        console.log('sync completed', deltaToken)
        return NextResponse.json({success:true},{status:200})
}