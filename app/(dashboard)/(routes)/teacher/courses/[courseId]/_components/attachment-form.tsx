"use client";

import * as z from 'zod';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, File, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Attachment, Course } from '@prisma/client';
import { FileUpload } from '@/components/file-upload';


interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

const formSchema = z.object({
    urls: z.array(z.string().min(1)), // Updated to accept multiple URLs
        
});


export const AttachmentForm = (
    {
        initialData,
        courseId,
    }: AttachmentFormProps
) => {

    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    

    const toggleEdit = () => {
        setIsEditing((current) => !current);
    }

    const router = useRouter();
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
       try {
           await axios.post(`/api/courses/${courseId}/attachments`, values);
           toast.success("Course Updated");
           toggleEdit();
           router.refresh();
       } catch {
           toast.error("Something went wrong");
       }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
           <div className='font-medium flex items-center justify-between'>
              Course attachments
              <Button onClick={toggleEdit} variant="ghost">
                {isEditing && (
                <>Cancel</>    
                )}
                {!isEditing && (
                    <>
                    <PlusCircle className='h-4 w-4 mr-2' />
                    Add files
                    </>
                )}
                
              </Button>
           </div>
           {!isEditing && (
          <>
          {initialData.attachments.length === 0 && (
        <p className='text-sm mt-2 text-slate-500 italic'>
             No attachments yet
        </p>    
        )}
        {initialData.attachments.length > 0 && (
            <div className='space-y-2'>
                {initialData.attachments.map((attachment) => (
                    <div 
                    key={attachment.id} 
                    className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'>
                    <File 
                    className='h-4 w-4 mr-2 flex-shrink-0' />
                    <p className='text-xs line-clamp-1'>
                        {attachment.name}
                    </p>
                    {deletingId === attachment.id && (
                    <div>
                        <Loader2 className='h-4 w-4 animate-spin' />
                    </div>    
                   )}
                    {deletingId !== attachment.id && (
                    <button onClick={() => onDelete(attachment.id)}
                    className="ml-auto hover:opacity-75 transition">
                        <X className='h-4 w-4' />
                        
                    </button>
                    )}
                    </div>

                ))}
            </div>
        )}
          </>
        )}
        {isEditing && (
            <div>
                <FileUpload
                endpoint="courseAttachment"
                onChange={(urls) => {
                    if (urls && urls.length > 0) {
                        onSubmit({ urls });
                    }
                }}
                />
                <div className='text-xs text-muted-foreground mt-4'>
                    Add anything  your students might need to Complete the course.
                </div>
            </div>
        )}
        </div>
    );

}

