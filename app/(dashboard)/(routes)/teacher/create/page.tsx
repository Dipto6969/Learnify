"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {

Form,
FormControl,
FormLabel,
FormDescription,
FormField,
FormMessage,
FormItem

} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";


//ekhane zod use kora hoyeche jate form validation kora jay
const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
});


//CreatePage component
const CreatePage = () => {

    const router = useRouter();
   
    //ekhane useForm hook use kora hoyeche jate formSchema k typescript type e covert kora jay and kon type is valid
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    //ekhane formState theke isSubmitting and isValid use kora hoyeche jate form submit korar por submit button disable hoye jay
    const { isSubmitting, isValid } = form.formState;
    //ekhane onSubmit function ta async function hisebe declare kora hoyeche jate form submit korar por api call kora jay
    const onSubmit = async ( values: z.infer<typeof formSchema>) => {
        try {
            //ekhane axios use kora hoyeche jate api call kora jay
           const response = await axios.post("/api/courses", values);
           //ekhane router.push use kora hoyeche jate course create korar por course page e redirect kora jay
            router.push(`/teacher/courses/${response.data.id}`);//dynamic route use kora hoyeche
            toast.success("Course created successfully");
        } catch {
           toast.error("An error occurred. Please try again.");
        }
    }

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
           <div>
            <h1 className="text-2xl">
                Name your course
            </h1>
            <p className="text-sm text-slate-600">
                What would you like to name your course. Do not worry you can change that later.
            </p>
            <Form {...form}>

                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-8"
                >
                    <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Course Title
                          </FormLabel>
                          <FormControl>
                            <Input 
                            disabled={isSubmitting}
                            placeholder="e.g. 'Advanced Web Development'"
                            {...field} />
                          </FormControl>
                          <FormDescription>
                            What will you teach in this course?
                          </FormDescription>
                            <FormMessage />
                                
                        </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Link href="/">
                        <Button type="button" variant="ghost">
                            Cancel
                        </Button>
                        </Link>
                        <Button type="submit" disabled={!isValid || isSubmitting}>
                            Continue
                        </Button>

                    </div>

                </form>

            </Form>
           </div>
        </div>
    )
}

export default CreatePage;