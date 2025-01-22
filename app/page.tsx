'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import * as fabric from 'fabric';
import {
  RefreshCw,
  Download,
  Coins,
  Atom,
  Moon,
  Instagram,
  ImageIcon,
  Type
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

import { setPlanType, toggleDarkMode, tokenDecrement, tokenIncrement } from '@/store/slices/userSlice'
import { resetState, setActiveTab, setBgColor, setUrl } from '@/store/slices/postSlice'
import ContentForm from '@/components/custom-ui/contentForm'
import axios from 'axios'
import { NextResponse } from 'next/server'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CanvasEditor from '@/components/custom-ui/CanvasEditor';


export default function Home() {
  const canvasRef = useRef<{ getCanvas: () => fabric.Canvas | null }>(null);

  const dispatch = useDispatch();
  const currentPlan = useSelector((state: RootState) => state.user.planType)
  const tokens = useSelector((state: RootState) => state.user.tokens)

  const text = useSelector((state: RootState) => state.post.text)
  const template = useSelector((state: RootState) => state.post.template)
  const dimensions = useSelector((state: RootState) => state.post.dimensions)
  const activeTab = useSelector((state: RootState) => state.post.activeTab)
  const url = useSelector((state: RootState) => state.post.url)
  const color = useSelector((state: RootState) => state.post.bgColor)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isGenerated, setIsGenerated] = useState<boolean>(false)


  const handleGenerate = async () => {

    console.log('Initial image url:', url);

    if (!text) return;

    if (text.length > 100) {
      toast({
        title: 'Text Too Long',
        description: `For Instagram ${activeTab}, the content text should be 100 characters or fewer.`,
        variant: 'destructive'
      });
      return;
    }

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

    setIsLoading(true)

    try {
      const response = await fetch('/api/findImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          format: activeTab,
          dimensions: dimensions,
          color: color
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      dispatch(setUrl(data.src[`${template.name === 'post' ? 'large' : 'portrait'}`]));
      dispatch(setBgColor(data.avg_color));
      console.log(data);

      setIsLoading(false);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.error?.message || error.message;

        return NextResponse.json(
          { message: "API request failed", error: errorMessage },
          { status: statusCode }
        );
      }

      return NextResponse.json(
        { message: "An unexpected error occurred." },
        { status: 500 }
      );
    }

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

    // Get the canvas instance through the ref
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) {
      toast({
        title: 'Error',
        description: 'Canvas not found',
        variant: 'destructive'
      });
      return;
    }

    // Convert canvas to data URL
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `pixify-${activeTab}-${new Date().getTime()}.png`; // Better filename

    // Programmatically click the link to trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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

  useEffect(() => {
    // Initialize canvas
    if (!canvasRef.current) {
      canvasRef.current = new fabric.Canvas('canvas', {
        width: 800,
        height: 600,
      });
    }

    // Your canvas initialization code here...
  }, []);

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
          <Tabs
            defaultValue={activeTab}
            className='w-full h-[70vh]'
            onValueChange={value => dispatch(setActiveTab(value))}
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='post'>
                <Instagram className='w-4 h-4 mr-2' />
                Post
              </TabsTrigger>
              <TabsTrigger value='story'>
                <ImageIcon className='w-4 h-4 mr-2' />
                Story
              </TabsTrigger>
              <TabsTrigger value='reel'>
                <Type className='w-4 h-4 mr-2' />
                Reel
              </TabsTrigger>
            </TabsList>

            <TabsContent value='post'>
              <CanvasEditor ref={canvasRef} />
            </TabsContent>

            <TabsContent value='story'>
              <CanvasEditor ref={canvasRef} />
            </TabsContent>

            <TabsContent value='reel'>
              <CanvasEditor ref={canvasRef} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
