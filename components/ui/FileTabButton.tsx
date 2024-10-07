import React from 'react'
import pdfIcon from '../../assets/icons/pdfIcon.svg'
function FileTabButton() {
  return (
    <div className='bg-white p-1 h-10 flex rounded-lg border-1 border-blue-200 drop-shadow'>
          <div className='mr-2 flex'>
            <img src={pdfIcon}/>
          </div>
            <span className='flex items-center text-sm font-medium'>What is React.Js</span>
    </div>
  )
}

export default FileTabButton