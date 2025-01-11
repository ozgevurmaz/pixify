'use client'

import { useEffect, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  RefreshCw,
  Download,
  Coins,
  Atom,
  Moon
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { fonts } from '@/lib/constants/font'
import { Input } from '@/components/ui/input'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import UploadButton from '@/components/custom-ui/uploadButton'
import ContentTabs from '@/components/custom-ui/contentTabs'
import { templates } from '@/lib/constants/template'
import { setPlanType, toggleDarkMode, tokenDecrement, tokenIncrement } from '@/store/slices/userSlice'
import { resetState, setAngle, setBgColor, setBgColor2, setFont, setFontSize, setPercentage, setPercentage2, setTemplate, setText, setTextColor } from '@/store/slices/postSlice'

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

  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false)
  const [isColorPickerOpen2, setIsColorPickerOpen2] = useState<boolean>(false)
  const [isColorPickerOpen3, setIsColorPickerOpen3] = useState<boolean>(false)

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

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            {/* Adding data from excel */}
            <UploadButton />


            {/* Form area for content information */}
            <Card className='bg-primary'>
              <CardContent className='pt-6'>
                <Textarea
                  placeholder='Enter your text here...'
                  className='min-h-[100px] bg-secondary'
                  value={text}
                  onChange={e => dispatch(setText(e.target.value))}
                />

                <div className='grid grid-cols-3 gap-4 mt-4'>

                  {/* Template Section */}

                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Template
                    </label>
                    <Select
                      onValueChange={id => {
                        const selectedTemplate = templates.find(t => t.id === Number(id))
                        if (
                          selectedTemplate &&
                          (!selectedTemplate.premium || currentPlan === 'premium')
                        ) {
                          dispatch(setTemplate(selectedTemplate));
                        }
                      }}
                    >
                      <SelectTrigger className='bg-secondary'>
                        <SelectValue placeholder='Select template' />
                      </SelectTrigger>
                      <SelectContent className='bg-secondary'>
                        {templates.map(t => (
                          <SelectItem
                            key={t.id}
                            value={String(t.id)}
                            disabled={t.premium && currentPlan === 'free'}
                          >
                            {t.name} {t.premium && ' (Premium)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Angle section for gradient */}

                  {template.name === "gradients" &&
                    <div >
                      <label className="text-sm font-medium mb-2 block">Gradient Angle</label>
                      <Input
                        type="number"
                        value={angle}
                        onChange={(e) => dispatch(setAngle(Number(e.target.value)))}
                        className="w-full border p-2 rounded bg-secondary"
                      />
                    </div>}

                  {/* BACKGROUND COLOR */}

                  <div className='flex gap-3 items-end'>
                    <div className='flex flex-col relative'>
                      <label className='text-sm font-medium mb-2 block'>
                        {template.name === "gradients" ? "Frist Color" : "Background Color"}
                      </label>
                      <Button
                        onClick={() => setIsColorPickerOpen2(!isColorPickerOpen2)}
                        style={{ backgroundColor: bgColor }}
                        className='w-full h-[40px] border hover:scale-105'
                      >
                        {bgColor}
                      </Button>

                      {isColorPickerOpen2 && (
                        <div className='absolute z-50 -bottom-80'>
                          <SketchPicker
                            color={bgColor}
                            onChangeComplete={color => {
                              dispatch(setBgColor(color.hex))
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {
                      /* First colors percentage */
                      template.name === "gradients" &&
                      <div className='flex gap-1 items-end'>
                        <Input
                          type="number"
                          min="0"
                          max="99"
                          value={percentage}
                          onChange={(e) => dispatch(setPercentage(e.target.value))}
                          className="border p-2 rounded min-w bg-secondary"
                        /><label className="text-xl font-medium mb-2 block">%</label>
                      </div>
                    }

                  </div>

                  <div className='flex gap-3 items-end'>
                    {
                      /* End Color and percentage for gradient */
                      template.name === "gradients" &&
                      <>
                        <div className='flex flex-col relative'>
                          <label className='text-sm font-medium mb-2 block'>
                            Second Color
                          </label>
                          <Button
                            onClick={() => setIsColorPickerOpen3(!isColorPickerOpen3)}
                            style={{ backgroundColor: bgColor2 }}
                            className='w-full h-[40px] border hover:scale-105'
                          >
                            {bgColor2}
                          </Button>
                          {isColorPickerOpen3 && (
                            <div className='absolute z-50 -bottom-80'>
                              <SketchPicker
                                color={bgColor2}
                                onChangeComplete={color => {
                                  dispatch(setBgColor2(color.hex))
                                }}
                              />
                            </div>
                          )}

                        </div>

                        <div className='flex gap-1 items-end'>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={percentage2}
                            onChange={(e) => dispatch(setPercentage2(e.target.value))}
                            className="border p-2 rounded min-w bg-secondary"
                          /><label className="text-xl font-medium mb-2 block">%</label>
                        </div></>}
                  </div>

                  {/* FONT TYPE */}
                  <div>
                    <label className='text-sm font-medium mb-2 block'>Font</label>
                    <Select

                      onValueChange={id => {
                        const selectedFont = fonts.find(f => f.id === Number(id))
                        if (
                          selectedFont &&
                          (!selectedFont.premium || currentPlan === 'premium')
                        ) {
                          dispatch(setFont(selectedFont))
                        }
                      }}
                    >
                      <SelectTrigger className='bg-secondary'>
                        <SelectValue placeholder='Select font' />
                      </SelectTrigger>
                      <SelectContent className='bg-secondary'>
                        {fonts.map(f => (
                          <SelectItem
                            key={f.id}
                            value={String(f.id)}
                            disabled={f.premium && currentPlan === 'free'}
                            className={`${f.class}`}
                          >
                            {f.name} {f.premium && ' (Premium)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* FONT SIZE */}
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Font Size
                    </label>
                    <Select
                      onValueChange={(value) => dispatch(setFontSize(Number(value)))}
                      defaultValue="30"
                    >
                      <SelectTrigger className='bg-secondary'>
                        <SelectValue placeholder='Select size' />
                      </SelectTrigger>
                      <SelectContent className='bg-secondary'>
                        {Array.from(
                          { length: 45 - 20 + 1 },
                          (_, i) => 20 + i
                        ).map(size => (
                          <SelectItem key={size} value={String(size)}>
                            {size}px
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* TEXT COLOR */}
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Text Color
                    </label>
                    <button
                      onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                      style={{ color: textColor }}
                      className='w-full h-[40px] border bg-secondary hover:scale-105 rounded-md'
                    >
                      {textColor}
                    </button>
                    {isColorPickerOpen && (
                      <div className='absolute z-50'>
                        <SketchPicker
                          color={textColor}
                          onChangeComplete={color => {
                            dispatch(setTextColor(color.hex))
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className='flex gap-2'>
              {/* Generate Button */}
              <Button
                className='flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                onClick={handleGenerate}
              >
                <Atom className='w-4 h-4 mr-2' />
                {isGenerated && template.name === "photo" ? "Try a New Generate" : "New Generate"}
              </Button>
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
