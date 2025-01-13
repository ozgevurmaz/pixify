import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Instagram,
  Image as ImageIcon,
  Type,
} from 'lucide-react'

import { useDispatch, useSelector } from 'react-redux'

import CanvasEditor from './CanvasEditor'
import { setActiveTab } from '@/store/slices/postSlice'
import { RootState } from '@/store/store';

const ContentTabs = () => {
  const dispatch = useDispatch();

  const activeTab = useSelector((state: RootState) => state.post.activeTab)

  return (
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
        <CanvasEditor />
      </TabsContent>

      <TabsContent value='story'>
        <CanvasEditor />
      </TabsContent>

      <TabsContent value='reel'>
        <CanvasEditor />
      </TabsContent>
    </Tabs>

  )
}

export default ContentTabs