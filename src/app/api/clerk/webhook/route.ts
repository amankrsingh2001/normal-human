import { db } from "@/server/db";
import { NextRequest } from "next/server";

export const POST = async(req:NextRequest)=>{

    const {data} = await req.json()
    console.log(data)
    const emailAddress = data.email_addresses[0].email_address
    const firstName = data.first_name
    const lastName = data.last_name
    const imageUrl = data.image_url

    await db.user.create({
        data:{
            emailAddress:emailAddress,
            firstName:firstName,
            lastName:lastName,
            imageUrl:imageUrl
        }
    })
    
    return new Response("webhook working", {status:200})
    
}