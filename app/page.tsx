'use client'

import { useEffect, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Instagram,
  Image as ImageIcon,
  Type,
  RefreshCw,
  Download,
  Upload,
  Coins,
  Building,
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
import { ContentPreview } from '@/components/ContentPreview'
import { Input } from '@/components/ui/input'
import CanvasEditor from '@/components/CanvasEditor'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { toggleDarkMode } from '@/store/slices/uiSlice'

type TabType = 'post' | 'story' | 'reel'
type PlanType = 'free' | 'premium'


export default function Home() {

  const dispatch = useDispatch();
  const isDarkMode = useSelector((state:RootState)=>state.ui.isDarkMode)

  const [plan, setPlan] = useState<PlanType>('free')

  const [tokens, setTokens] = useState<number>(2)
  
  const [text, setText] = useState<string>('')
  const [font, setFont] = useState<Font>(fonts[0])
  const [fontSize, setFontSize] = useState<string>('text-[30px]')
  const [activeTab, setActiveTab] = useState<TabType>('post')
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isGenerated, setIsGenerated] = useState<boolean>(false)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false)
  const [textColor, setTextColor] = useState<string>('#000000')
  const [isColorPickerOpen2, setIsColorPickerOpen2] = useState<boolean>(false)
  const [bgColor, setBgColor] = useState<string>('#fff')
  const [isColorPickerOpen3, setIsColorPickerOpen3] = useState<boolean>(false)
  const [bgColor2, setBgColor2] = useState<string>('#fff')
  const [percentage, setPercentage] = useState<string>("0")
  const [percentage2, setPercentage2] = useState<string>("100")
  const [angle, setAngle] = useState<number>(90)


  const templates: Template[] = [
    {
      id: 'minimal', name: 'Minimal', bg: bgColor, color: textColor
    },
    {
      id: 'gradient',
      name: 'Gradient',
      bg: bgColor,
      gradient: {
        type: "linear",
        angle: angle,
        color1: bgColor,
        percentage1: percentage,
        color2: bgColor2,
        percentage2: percentage2
      },
      color: textColor
    },
    {
      id: 'photo',
      name: 'Photo',
      bg: bgColor,
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
      color: textColor,
      premium: true
    }
  ]

  const [template, setTemplate] = useState<Template>(templates[0])

  const handleGenerate = () => {
    if (tokens <= 0 && plan === 'free') {
      toast({
        title: 'No tokens remaining',
        description: 'Please upgrade to premium or purchase more tokens',
        variant: 'destructive'
      })
      return
    }

    if (plan === 'free') {
      setTokens(prev => prev - 1)
    }

    // Generating logic here

    setIsGenerated(true)
    toast({
      title: 'Generating',
      description: 'Your content is generated'
    })
  }

  const handleDownload = () => {
    if (tokens <= 0 && plan === 'free') {
      toast({
        title: 'No tokens remaining',
        description: 'Please upgrade to premium or purchase more tokens',
        variant: 'destructive'
      })
      return
    }

    if (plan === 'free') {
      setTokens(prev => prev - 1)
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


  // seeting template wherver variables changed
  useEffect(() => {
    if (Number(percentage) >= Number(percentage2)) {
      setPercentage2(String(Number(percentage) + 1));
    }

    const newBg =
      template.id === 'gradient'
        ? `linear-gradient(${angle}deg, ${bgColor} ${percentage}%, ${bgColor2} ${percentage2}%)`
        : bgColor;

    setTemplate(prevTemplate => ({
      ...prevTemplate,
      bg: template.id === 'photo'
        ? `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80')`
        : newBg,
      color: textColor
    }));
  }, [bgColor, textColor, bgColor2, template.id, angle, percentage, percentage2]);


  return (
    <div className='w-full h-screen bg-background'>
    <div className='container mx-auto px-4 py-8 h-screen bg-inherit'>
      <div className='flex w-full justify-center relative items-end mb-8'>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Pixify
        </h1>
       <button onClick={()=>dispatch(toggleDarkMode())} className=''><Moon className="w-5 h-5 absolute left-0 top-0" /> </button>
      
        {/* PLANS OR GETTING TOKENS */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 absolute right-0">
              <Coins className="w-4 h-4" />
              {plan === 'free'
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
                onClick={() => setPlan('premium')}
                className='bg-gradient-to-r from-purple-500 to-pink-500'
                disabled={plan === 'premium'}
              >
                Upgrade to Premium
              </Button>
              <Button
                onClick={() => setTokens(prev => prev + 10)}
                variant='outline'
                disabled={plan === 'premium'}
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
          <Button
            className='flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            onClick={handleUpload}
            disabled={isUploading}
          >
            <Upload className='w-4 h-4 mr-2' />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>


          {/* Form area for content information */}
          <Card className='bg-primary'>
            <CardContent className='pt-6'>
              <Textarea
                placeholder='Enter your text here...'
                className='min-h-[100px] bg-secondary'
                value={text}
                onChange={e => setText(e.target.value)}
              />

              <div className='grid grid-cols-3 gap-4 mt-4'>
                {/* Template Section */}
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Template
                  </label>
                  <Select
                    onValueChange={id => {
                      const selectedTemplate = templates.find(t => t.id === id)
                      if (
                        selectedTemplate &&
                        (!selectedTemplate.premium || plan === 'premium')
                      ) {
                        setTemplate(selectedTemplate)
                      }
                    }}
                  >
                    <SelectTrigger className='bg-secondary'>
                      <SelectValue placeholder='Select template'  />
                    </SelectTrigger>
                    <SelectContent  className='bg-secondary'>
                      {templates.map(t => (
                        <SelectItem
                          key={t.id}
                          value={t.id}
                          disabled={t.premium && plan === 'free'}
                        >
                          {t.name} {t.premium && ' (Premium)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Angle section for gradient */}
                {template.id === "gradient" &&
                  <div >
                    <label className="text-sm font-medium mb-2 block">Gradient Angle</label>
                    <Input
                      type="number"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-full border p-2 rounded bg-secondary"
                    />
                  </div>}

                {/* BACKGROUND COLOR */}
                <div className='flex gap-3 items-end'>
                  <div className='flex flex-col relative'>
                    <label className='text-sm font-medium mb-2 block'>
                      {template.name === "Gradient" ? "Frist Color" : "Background Color"}
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
                            setBgColor(color.hex)
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {
                    /* First colors percentage */
                    template.id === "gradient" &&
                    <div className='flex gap-1 items-end'>
                      <Input
                        type="number"
                        min="0"
                        max="99"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        className="border p-2 rounded min-w bg-secondary"
                      /><label className="text-xl font-medium mb-2 block">%</label>
                    </div>
                  }

                </div>

                <div className='flex gap-3 items-end'>
                  {
                    /* End Color and percentage for gradient */
                    template.name === "Gradient" &&
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
                                setBgColor2(color.hex)
                              }}
                            />
                          </div>
                        )}

                      </div>

                      <div className='flex gap-1 items-end'>
                        <Input
                          type="number"
                          min="0"
                          max="99"
                          value={percentage2}
                          onChange={(e) => setPercentage2(e.target.value)}
                          className="border p-2 rounded min-w bg-secondary"
                        /><label className="text-xl font-medium mb-2 block">%</label>
                      </div></>}
                </div>

                {/* FONT TYPE */}
                <div>
                  <label className='text-sm font-medium mb-2 block'>Font</label>
                  <Select
                   
                    onValueChange={id => {
                      const selectedFont = fonts.find(f => f.id === id)
                      if (
                        selectedFont &&
                        (!selectedFont.premium || plan === 'premium')
                      ) {
                        setFont(selectedFont)
                      }
                    }}
                  >
                    <SelectTrigger  className='bg-secondary'>
                      <SelectValue placeholder='Select font' />
                    </SelectTrigger>
                    <SelectContent  className='bg-secondary'>
                      {fonts.map(f => (
                        <SelectItem
                          key={f.id}
                          value={f.id}
                          disabled={f.premium && plan === 'free'}
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
                    onValueChange={setFontSize}
                    defaultValue='text-[30px]'
                  >
                    <SelectTrigger className='bg-secondary'>
                      <SelectValue placeholder='Select size' />
                    </SelectTrigger>
                    <SelectContent  className='bg-secondary'>
                      {Array.from(
                        { length: 45 - 20 + 1 },
                        (_, i) => 20 + i
                      ).map(size => (
                        <SelectItem key={size} value={`text-[${size}px]`}>
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
                    className='w-full h-[40px] border bg-secondary hover:scale-105'
                  >
                    {textColor}
                  </button>
                  {isColorPickerOpen && (
                    <div className='absolute z-50'>
                      <SketchPicker
                        color={textColor}
                        onChangeComplete={color => {
                          setTextColor(color.hex)
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
              {isGenerated && template.id === "nature" ? "Try a New Generate" : "New Generate"}
            </Button>
            {/* Download Button */}
            <Button
              className='flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              onClick={handleDownload}
              disabled={template.id === "nature" ? !isGenerated : false}
            >
              <Download className='w-4 h-4 mr-2' />
              Download
            </Button>

            {/* Reset Button */}
            <Button variant='outline' className='bg-primary' onClick={() => setText('')}>
              <RefreshCw className='w-4 h-4 mr-2' />
              Reset
            </Button>
          </div>
        </div>

        {/* Tabs for content */}
        <div>
          <Tabs
            defaultValue='post'
            className='w-full h-[70vh]'
            onValueChange={value => setActiveTab(value as TabType)}
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

              <CanvasEditor
                aspectRatio="aspect-square"
                template={template}
                font={font}
                fontSize={fontSize}
                text={text}
                textColor={textColor}
              />

            </TabsContent>

            <TabsContent value='story'>

              <CanvasEditor
                aspectRatio="aspect-[9/16]"
                template={template}
                font={font}
                fontSize={fontSize}
                text={text}
                textColor={textColor}
              />

            </TabsContent>

            <TabsContent value='reel'>

              <CanvasEditor
                aspectRatio="aspect-[9/16]"
                template={template}
                font={font}
                fontSize={fontSize}
                text={text}
                textColor={textColor}
              />

            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </div>
  )
}
