"use client"

import React, { useEffect, useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { SketchPicker } from 'react-color'


import { fonts } from '@/lib/constants/font'
import { Input } from '@/components/ui/input'
import { templates } from '@/lib/constants/template'


import { setAngle, setBgColor, setBgColor2, setFont, setFontSize, setPercentage, setPercentage2, setTemplate, setText, setTextColor } from '@/store/slices/postSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Button } from '../ui/button'

const ContentForm = () => {
    const dispatch = useDispatch();

    const currentPlan = useSelector((state: RootState) => state.user.planType)

    const text = useSelector((state: RootState) => state.post.text);
    const template = useSelector((state: RootState) => state.post.template);
    const font = useSelector((state: RootState) => state.post.font);
    const bgColor = useSelector((state: RootState) => state.post.bgColor);
    const textColor = useSelector((state: RootState) => state.post.textColor);
    const fontSize = useSelector((state: RootState) => state.post.fontSize);
    const bgColor2 = useSelector((state: RootState) => state.post.bgColor2);
    const angle = useSelector((state: RootState) => state.post.angle);
    const percentage = useSelector((state: RootState) => state.post.percentage);
    const percentage2 = useSelector((state: RootState) => state.post.percentage2);

    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false)
    const [isColorPickerOpen2, setIsColorPickerOpen2] = useState<boolean>(false)
    const [isColorPickerOpen3, setIsColorPickerOpen3] = useState<boolean>(false)



    return (
        <Card className='bg-primary'>
            <CardContent className='pt-6'>
                <Textarea
                    placeholder='Enter your text here...'
                    className='h-[2rem] bg-secondary resize-none '
                    value={text}
                    onChange={e => dispatch(setText(e.target.value))}
                />
                <p className={`text-sm mt-1 ml-1 opacity-60 ${text.length === 100 ? "text-orange-500" : text.length > 100 ? "text-red-500" : "text-foreground"}`}>{text.length}/100 characters</p>

                <div className='grid grid-cols-3 gap-2 xl:gap-4 mt-4'>

                    {/* Template Section */}

                    <div>
                        <label className='text-sm font-medium mb-2 block'>
                            Template
                        </label>
                        <Select
                            defaultValue={String(template.id)}
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

                    {/* Backgrounds Section */}

                    {
                        template.name === "gradients" ?
                            <div className='col-span-2'>
                                <div>
                                    <div className='flex gap-1 xl:gap-3'>

                                        {/* Angle */}

                                        <div className='flex flex-col'>
                                            <label className="text-sm font-medium mb-2 block" >Angle</label>
                                            <Input
                                                type="number"
                                                value={angle}
                                                onChange={(e) => dispatch(setAngle(Number(e.target.value)))}
                                                className="w-12 border p-2 rounded bg-secondary"
                                            />
                                        </div>

                                        {/* First Color */}

                                        <div className='flex flex-col'>
                                            <label className='text-sm font-medium mb-2 block'>
                                                First Color
                                            </label>
                                            <div className='flex gap-1'>
                                                <div className='flex flex-col relative'>
                                                    <Button
                                                        onClick={() => setIsColorPickerOpen2(!isColorPickerOpen2)}
                                                        style={{ backgroundColor: bgColor }}
                                                        className='w-[20px] h-[40px] border hover:scale-105'
                                                    >
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
                                                <div className='flex gap-1 items-end'>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={percentage}
                                                        onChange={(e) => dispatch(setPercentage(e.target.value))}
                                                        className="border p-2 rounded w-12 bg-secondary"
                                                    /><label className="text-md xl:text-xl font-medium mb-2 block">%</label>
                                                </div>
                                            </div>


                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-sm font-medium mb-2 block'>
                                                Second Color
                                            </label>
                                            <div className='flex gap-1'>
                                                <div className='flex flex-col relative'>
                                                    <Button
                                                        onClick={() => setIsColorPickerOpen3(!isColorPickerOpen3)}
                                                        style={{ backgroundColor: bgColor2 }}
                                                        className='w-[20px] h-[40px] border hover:scale-105'
                                                    >
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
                                                <div className='flex gap-1 -end'>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={percentage2}
                                                        onChange={(e) => dispatch(setPercentage(e.target.value))}
                                                        className="border p-2 rounded w-12 bg-secondary"
                                                    /><label className="text-md xl:text-xl font-medium mb-2 block">%</label>
                                                </div>
                                            </div>


                                        </div>

                                    </div>


                                </div>
                            </div> : template.name === "minimal" ?

                                <div className='flex gap-3 items-end'>
                                    <div className='flex flex-col relative'>
                                        <label className='text-sm font-medium mb-2 block'>
                                            Background Color
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

                                </div>
                                :
                                <div></div>

                    }

                    {template.name !== "gradients" && <div></div>}




                    {/* FONT TYPE */}
                    <div>
                        <label className='text-sm font-medium mb-2 block'>Font</label>
                        <Select
                            defaultValue={String(font.id)}
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
                            defaultValue={String(fontSize)}
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
                {
                    template.name === "photo" &&
                    <p className='text-sm ml-1 mt-2 -mb-3 opacity-60'>When you ready, click generate button to generate image.</p>
                }
            </CardContent>

        </Card>
    )
}

export default ContentForm