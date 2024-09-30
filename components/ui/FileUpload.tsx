'use client'

import { s3upload } from '@/lib/s3'
import React from 'react'
import {useDropzone} from 'react-dropzone'
import axios from "axios"
import { useMutation } from '@tanstack/react-query'
import toast from "react-hot-toast"
const FileUpload = () => {

  const [loading, setLoading] = React.useState(false) 
  const {mutate, isPending} = useMutation({
    mutationFn: async({file_key, file_name}:{
      file_key : string,
      file_name : string
    }) => {
      const response = await axios.post('/api/create-chat',{
        file_key,
        file_name
      });
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
                const data = await s3upload(file)
                if(!data?.file_key || !data.file_name){
                  toast.error("Something Went Wrong")
                  return 
                }
                mutate(data,{
                  onSuccess:(data)=>{
                    console.log(data)
                  },
                  onError:(err)=>{
                    console.log(err)
                  }
                })
                
            } catch (error) {
              console.log("Failed to Upload File")
            }
            finally{
              setLoading(false)
            }

        }
    })
  return (
    <div {...getRootProps()} className='border-2 border-dashed p-2 bg-slate-50 h-5 w-24'>
    <input {...getInputProps()} />
    {
      isDragActive ?
        <p>Drop the files here ...</p> :
        <p>Drag 'n' drop some files here, or click to select files</p>
    }
  </div>
  )
}

export default FileUpload