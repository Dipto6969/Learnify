import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
)  {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if(!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.create({
            data: {
                userId,
                title,
            }
        });

        return NextResponse.json(course); 
    }

    catch(error) {
         console.log("[COURSES]", error);
        return new NextResponse("An error occurred", { status: 500 }); 
    }
}