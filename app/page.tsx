'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

import {
  RefreshCw,
  Download,
  Coins,
  Atom,
  Moon
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import UploadButton from '@/components/custom-ui/uploadButton'
import ContentTabs from '@/components/custom-ui/contentTabs'

import { setPlanType, toggleDarkMode, tokenDecrement, tokenIncrement } from '@/store/slices/userSlice'
import { resetState } from '@/store/slices/postSlice'
import ContentForm from '@/components/custom-ui/contentForm'

export default function Home() {

  const dispatch = useDispatch();
  const currentPlan = useSelector((state: RootState) => state.user.planType)
  const tokens = useSelector((state: RootState) => state.user.tokens)

  const text = useSelector((state: RootState) => state.post.text)
  const template = useSelector((state: RootState) => state.post.template)
  const font = useSelector((state: RootState) => state.post.font)
  const bgColor = useSelector((state: RootState) => state.post.bgColor)
  const textColor = useSelector((state: RootState) => state.post.textColor)
  const fontSize = useSelector((state: RootState) => state.post.fontSize)
  const activeTab = useSelector((state: RootState) => state.post.activeTab)
  const bgColor2 = useSelector((state: RootState) => state.post.bgColor2)
  const angle = useSelector((state: RootState) => state.post.angle)
  const percentage = useSelector((state: RootState) => state.post.percentage)
  const percentage2 = useSelector((state: RootState) => state.post.percentage2)


  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isGenerated, setIsGenerated] = useState<boolean>(false)


  const handleGenerate = () => {
    if (tokens <= 0 && currentPlan === 'free') {
      toast({
        title: 'No tokens remaining',
        description: 'Please upgrade to premium or purchase more tokens',
        variant: 'destructive'
      })
      return
    }

    if (currentPlan === 'free') {
      dispatch(tokenDecrement(1))
    }

    // Generating logic here

    setIsGenerated(true)
    toast({
      title: 'Generating',
      description: 'Your content is generated'
    })
  }

  const handleDownload = () => {
    if (tokens <= 0 && currentPlan === 'free') {
      toast({
        title: 'No tokens remaining',
        description: 'Please upgrade to premium or purchase more tokens',
        variant: 'destructive'
      })
      return
    }

    if (currentPlan === 'free') {
      dispatch(tokenDecrement(1))
    }

    // Download logic here
    toast({
      title: 'Download started',
      description: 'Your content is being prepared for download'
    })
  }

  const handleUpload = async () => {
    setIsUploading(true)
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
      setIsUploading(false)
    }
  }

  return (
    <div className='w-full h-screen bg-background'>
      <div className='container mx-auto px-4 py-8 h-screen bg-inherit'>
        <div className='flex w-full justify-center relative items-end mb-8'>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-poppins">
            Pixify
          </h1>
          <button onClick={() => dispatch(toggleDarkMode())} className=''><Moon className="w-5 h-5 absolute left-0 top-0" /> </button>

          {/* PLANS OR GETTING TOKENS */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 absolute right-0">
                <Coins className="w-4 h-4" />
                {currentPlan === 'free'
                  ? `${tokens} token${tokens !== 1 ? 's' : ''} left`
                  : 'Premium'}
              </Button>
            </DialogTrigger>

            {/* Premium Plan Dialog */}
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Upgrade Your Plan</DialogTitle>
                <DialogDescription>
                  Choose the plan that best suits your needs
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <Button
                  onClick={() => dispatch(setPlanType("premium"))}
                  className='bg-gradient-to-r from-purple-500 to-pink-500'
                  disabled={currentPlan === 'premium'}
                >
                  Upgrade to Premium
                </Button>
                <Button
                  onClick={() => dispatch(tokenIncrement(5))}
                  variant='outline'
                  disabled={currentPlan === 'premium'}
                >
                  Buy 5 Tokens
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className='grid xl:grid-cols-2 gap-8'>
          {/* Interactions */}
          <div className='space-y-6'>
            {/* Adding data from excel */}
            <UploadButton />

            <ContentForm />

            <div className='flex gap-2'>
              {/* Generate Button */}
              {
                template.name === "photo" &&
                <Button
                  className='flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  onClick={handleGenerate}
                >
                  <Atom className='w-4 h-4 mr-2' />
                  {isGenerated && template.name === "photo" ? "Try a New Generate" : "New Generate"}
                </Button>}
              {/* Download Button */}
              <Button
                className='flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                onClick={handleDownload}
                disabled={template.name === "photo" ? !isGenerated : false}
              >
                <Download className='w-4 h-4 mr-2' />
                Download
              </Button>

              {/* Reset Button */}
              <Button variant='outline' className='bg-primary' onClick={() => dispatch(resetState())}>
                <RefreshCw className='w-4 h-4 mr-2' />
                Reset
              </Button>
            </div>
          </div>

          {/* Tabs for content */}
          <ContentTabs />
        </div>
      </div>
    </div>
  )
}
