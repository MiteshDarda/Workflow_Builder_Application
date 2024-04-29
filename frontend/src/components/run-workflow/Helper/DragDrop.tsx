import React, { Dispatch, SetStateAction } from 'react'
import { useDropzone } from 'react-dropzone'
import AttachmentIcon from '@mui/icons-material/Attachment'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Button } from '@mui/material'

//$ Type .
type PropType = {
  acceptedFiles: File[]
  setAcceptedFiles: Dispatch<SetStateAction<File[]>>
  disabled: boolean
}

const DragDrop = ({ acceptedFiles, setAcceptedFiles, disabled }: PropType) => {
  //$ Constants .
  const acceptedFileTypes: { [key: string]: string[] } = {
    'text/csv': ['.csv'],
  }

  //$ Functions .
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: acceptedFileTypes,
    disabled,
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

  //$ JSX .
  return (
    <div className="grow max-h-[50%] max-w-[50%]">
      <div
        {...getRootProps({
          className:
            `dropzone relative h-full w-full flex flex-col  border-4 border-dashed hover:bg-gray-100 rounded-lg p-4 flex justify-center items-center` +
            ` ` +
            `${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`,
        })}
      >
        <input {...getInputProps()} />
        {acceptedFiles.length ? (
          <>
            <Button
              variant="contained"
              color="error"
              sx={{ margin: '1rem', position: 'absolute', top: 0, right: 0 }}
              onClick={clearFiles}
            >
              <DeleteForeverIcon />
            </Button>
            <div className="text-sm">
              <u>Select Workflow-id </u> OR Drag 'n' drop a *.CSV file here, or
              click to overwrite the previous file
            </div>
          </>
        ) : (
          <div className="text-sm">
            Drag 'n' drop a *.CSV file here, or click to select a file
          </div>
        )}
        {acceptedFiles.map((file: File) => (
          <div
            key={file.name}
            className="mt-4 sm:h-[50%] sm:w-[50%] text-xs flex items-center bg-gray-600 text-white p-2 rounded-lg"
          >
            <AttachmentIcon className="mr-5 text-yellow-500" />
            <div>{file.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DragDrop
