import { db } from "./server/db";

await db.user.create({
    data:{
        emailAddress:"Singhamankr18@gmail.com",
        firstName:"Aman kr singh",
        lastName:"Singh"
    }
})