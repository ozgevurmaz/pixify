import { toast } from "@/hooks/use-toast"
import { setIsGenerated, setIsUploading, tokenDecrement } from "@/store/slices/uiSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux"



export const handleGenerate = () => {
    const dispatch = useDispatch();
    const tokens = useSelector((state: RootState) => state.ui.tokens)
    const plan = useSelector((state: RootState) => state.ui.planType)
    if (tokens <= 0 && plan === 'free') {
        toast({
            title: 'No tokens remaining',
            description: 'Please upgrade to premium or purchase more tokens',
            variant: 'destructive'
        })
        return
    }

    if (plan === 'free') {
        dispatch(tokenDecrement(1));
    }

    // Generating logic here

    dispatch(setIsGenerated(true))
    toast({
        title: 'Generating',
        description: 'Your content is generated'
    })
}

export const handleDownload = () => {
    const dispatch = useDispatch();
    const tokens = useSelector((state: RootState) => state.ui.tokens)
    const plan = useSelector((state: RootState) => state.ui.planType)
    if (tokens <= 0 && plan === 'free') {
        toast({
            title: 'No tokens remaining',
            description: 'Please upgrade to premium or purchase more tokens',
            variant: 'destructive'
        })
        return
    }

    if (plan === 'free') {
        dispatch(tokenDecrement(1));
    }

    // Download logic here
    toast({
        title: 'Download started',
        description: 'Your content is being prepared for download'
    })
}

export const handleUpload = async () => {
    const dispatch = useDispatch();
    const tokens = useSelector((state: RootState) => state.ui.tokens)
    const plan = useSelector((state: RootState) => state.ui.planType)
    dispatch(setIsUploading(true));
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
