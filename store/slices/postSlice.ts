import { fonts } from "@/lib/constants/font";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
    text: string;
    font: Font;
    fontSize: number;
    textColor: string;

    activeTab: 'post' | 'story' | 'reel';
    template: 'minimal' | 'gradient' | 'photo';
    bgColor: string;
    bgColor2: string;
    percentage: string;
    percentage2: string;
    angle: number;
    url: string;

    isUploading: boolean;
}

const initialState = {
    text: "",
    font: fonts[0],
    fontSize: 30,
    textColor: '#000000',
    activeTab: 'post',
    template: 'minimal',
    bgColor: '#fff',
    bgColor2: '#fff',
    percentage: '0',
    percentage2: '100',
    angle: 90,
    url: "https://images.unsplash.com/photo-1736246633159-bc8735d6c63b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isUploading: false

};

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setText: (state, action: PayloadAction<string>) => {
            state.text = action.payload;
        },
        setFont: (state, action) => {
            state.font = action.payload;
        },
        setFontSize: (state, action) => {
            state.fontSize = action.payload;
        },
        setTextColor: (state, action) => {
            state.textColor = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setTemplate: (state, action) => {
            state.template = action.payload;
        },
        setBgColor: (state, action) => {
            state.bgColor = action.payload;
        },
        setBgColor2: (state, action) => {
            state.bgColor2 = action.payload;
        },
        setPercentage: (state, action) => {
            state.percentage = action.payload;
        },
        setPercentage2: (state, action) => {
            state.percentage2 = action.payload;
        },
        setAngle: (state, action) => {
            state.angle = action.payload;
        },
        setIsUploading: (state, action) => {
            state.isUploading = action.payload;
        },
        resetState: () => initialState,
    },
});

export const {
    setText,
    setFont,
    setFontSize,
    setActiveTab,
    setTemplate,
    setTextColor,
    setBgColor,
    setBgColor2,
    setPercentage,
    setPercentage2,
    setAngle,
    resetState,
    setIsUploading
} = postSlice.actions;


export default postSlice.reducer;