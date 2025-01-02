import { db } from "@/server/db"

export const POST = async(req:Request)=>{
    const {data} = await req.json()
    console.log(data,"THIS IS THE DATA")
    const emailAddress = data.email_addresses[0].email_address
    const firstName = data.first_name
    const lastName = data.last_name
    const imageUrl = data.image_url

    const createUser = await db.user.create({
        data:{
            email:emailAddress,
            firstName:firstName,
            lastName:lastName,
            imageUrl:imageUrl
        }
    })
    console.log("userCreated", createUser)

    return new Response('webhook recieved', {status:200})
}