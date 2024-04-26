import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import AttachmentIcon from '@mui/icons-material/Attachment'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Button } from '@mui/material'

const Dropzone: React.FC = () => {
  const acceptedFileTypes: { [key: string]: string[] } = {
    // : ['text/csv'],
    'text/csv': ['.csv'],
  }

  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: acceptedFileTypes,
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      setAcceptedFiles(acceptedFiles)
    },
  })

  const clearFiles = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setAcceptedFiles([])
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        {...getRootProps({
          className:
            'dropzone w-[50vw] flex flex-col h-[50vh] border-4 border-dashed hover:bg-gray-100 rounded-lg cursor-pointer p-4 flex justify-center items-center',
        })}
      >
        <input {...getInputProps()} />
        {acceptedFiles.length ? (
          <>
            <Button
              variant="contained"
              color="error"
              sx={{ margin: '1rem' }}
              onClick={clearFiles}
            >
              <DeleteForeverIcon />
            </Button>
            <div>
              Drag 'n' drop a *.CSV file here, or click to overwrite the
              previous file
            </div>
          </>
        ) : (
          <>Drag 'n' drop a *.CSV file here, or click to select a file</>
        )}
        {acceptedFiles.map((file: File) => (
          <div
            key={file.name}
            className="mt-4 flex items-center bg-gray-600 text-white p-2 rounded-lg"
          >
            <AttachmentIcon className="mr-5 text-yellow-500" />
            <div>{file.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dropzone
