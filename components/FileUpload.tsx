'use client'

import React from 'react'
import {useDropzone} from 'react-dropzone'
import axios, { AxiosError } from "axios"
import { useMutation } from '@tanstack/react-query'
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from '@clerk/nextjs'



/**
 * Drag-and-drop uploader for PDFs.
 * - Requires authentication; unauthenticated users are redirected to sign-in.
 * - Uploads to S3, then triggers Pinecone ingestion via /api/create-chat.
 */
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

    const {getRootProps, getInputProps} = useDropzone({
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
    <>
    <div {...getRootProps()} className='bg-white p-1.5 h-12 flex items-center justify-center rounded-xl border-dashed border-2 border-blue-200 cursor-pointer text-center'>
    <input {...getInputProps()} />
    <label
        className="flex items-center justify-center"
      >
        <span className="bg-slate-300 p-1 mr-2 rounded-md">
        <img className="w-5 text-gray-800" src='/assets/icons/upload.svg'/>
        </span>
        <span className="items-center text-sm font-medium flex">
          Drag & drop or &nbsp;<p className="text-blue-700"> browser files</p>
        </span>
      </label>
    {/* {
      isDragActive ?
        <p>Drop the files here ...</p> :
        <p>Drag 'n' drop some files here, or click to select files</p>
    } */}
  </div>
  </>
  )
}

export default FileUpload