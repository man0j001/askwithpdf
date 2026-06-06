'use client'

import React from 'react'
import {useDropzone} from 'react-dropzone'
import axios, { AxiosError } from "axios"
import { useMutation } from '@tanstack/react-query'
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useAuth } from '@clerk/nextjs'
import { cn } from '@/lib/utils'



const FileUpload = () => {

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const {mutate} = useMutation({
    mutationFn: async({formData }:{
      formData : FormData,
    }) => {
      const response = await axios.post('/api/create-chat',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' },}
      );
      return response.data
    },
  })

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept:{'application/pdf':['.pdf']},
        maxFiles:1,
        onDrop: async (acceptedFiles)=>{
            if (!isSignedIn) {
                toast.error('Please sign in or sign up to upload a PDF.');
                router.push('/sign-in');
                return;
            }
            const file = acceptedFiles[0]
            if (file.size > 10* 1024 * 1024){
                toast.error('Please Upload Smallar File')
                return
            }
            try {
                const formData = new FormData();
                formData.append("file", file);
                const toastId = toast.loading("Uploading...");

                mutate({ formData }, {
                  onSuccess: (data) => {
                    // Update the toast on success
                    toast.success("Chat created!", { id: toastId });
                    router.push(`/chat/${data.chat_id}`);
                  },
                  onError: (err) => {
                    // Update the toast on error
                    const status = (err as AxiosError)?.response?.status;
                    if (status === 401) {
                      toast.error("Please sign in or sign up to upload a PDF.", { id: toastId });
                      router.push('/sign-in');
                    } else {
                      toast.error("Upload failed!", { id: toastId });
                    }
                    console.log(err);
                  }
                });

            } catch (error) {
              console.log("Failed to Upload File")
            }
            finally{
              console.log("Uploaded File")
            }

        }
    })
  return (
    <div
      {...getRootProps()}
      className={cn(
        "group flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed px-3 text-center transition-colors",
        isDragActive
          ? "border-rust/50 bg-apricot-wash/60"
          : "border-dove bg-pure-white hover:border-rust/40 hover:bg-apricot-wash/40",
      )}
    >
      <input {...getInputProps()} />
      <label className="flex cursor-pointer items-center justify-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-fog text-graphite transition-colors group-hover:bg-apricot-wash group-hover:text-rust">
          <Upload className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="flex items-center text-[14px] font-medium tracking-[-0.009em] text-ash">
          {isDragActive ? (
            <span className="text-rust">Drop your PDF here</span>
          ) : (
            <>
              Drag &amp; drop or&nbsp;<span className="text-rust">browse files</span>
            </>
          )}
        </span>
      </label>
    </div>
  )
}

export default FileUpload
