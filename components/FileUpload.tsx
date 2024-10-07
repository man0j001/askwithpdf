'use client'

import React from 'react'
import {useDropzone} from 'react-dropzone'
import axios from "axios"
import { useMutation } from '@tanstack/react-query'
import toast, { Toaster } from "react-hot-toast"; // Import Toaster
import { useRouter } from "next/navigation";


const FileUpload = () => {

  const [loading, setLoading] = React.useState(false) 
  const router = useRouter();
  const {mutate, isPending} = useMutation({
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
            const file = acceptedFiles[0]
            if (file.size > 10* 1024 * 1024){
                toast.error('Please Upload Smallar File')
                return 
            }
            try {
                setLoading(true)
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
                    toast.error("Upload failed!", { id: toastId });
                    console.log(err);
                  }
                });
                
            } catch (error) {
              console.log("Failed to Upload File")
            }
            finally{
              setLoading(false)
            }

        }
    })
  return (
    <>
    <Toaster />
    <div {...getRootProps()} className='bg-white p-1.5 h-12 flex rounded-xl border-dashed border-2 border-blue-200 cursor-pointer'>
    <input {...getInputProps()} />
    <label
        className="flex"
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