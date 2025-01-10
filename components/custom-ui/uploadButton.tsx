import React from 'react'
import { Button } from '../ui/button'
import { Upload } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { toast } from '@/hooks/use-toast'
import { setIsUploading } from '@/store/slices/postSlice'

const UploadButton = () => {

    const dispatch= useDispatch();
    const isUploading = useSelector((state:RootState)=>state.post.isUploading);

    const handleUpload = async () => {
        dispatch(setIsUploading(true))
        try {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
    
          input.onchange = async (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              // Upload logic here
              toast({
                title: 'File uploaded',
                description: 'Your image has been uploaded successfully'
              })
            }
          }
    
          input.click()
        } catch (error) {
          toast({
            title: 'Upload failed',
            description: 'There was an error uploading your file',
            variant: 'destructive'
          })
        } finally {
            dispatch(setIsUploading(false))
        }
      }


    return (
        <Button
            className='flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            onClick={handleUpload}
            disabled={isUploading}
        >
            <Upload className='w-4 h-4 mr-2' />
            {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
    )
}

export default UploadButton