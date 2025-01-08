import { fonts } from "@/lib/constants/font";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { text } from "stream/consumers";

export interface initialStateTypes {
    isDarkMode: boolean;
    planType: 'free' | 'premium';
    tokens: number;
    text: string;
    font: Font;
    fontSize: number;
    activeTab: 'post' | 'story' | 'reel';
    isUploading: boolean;
    textColor: string;
    bgColor: string;
    bgColor2: string;
    percentage: string;
    percentage2: string;
    angle: number;
}

const initialState = {
    isDarkMode: false,
    planType: 'free',
    tokens: 2,
    text: "",
    font: fonts[0],
    fontSize: 30,
    activeTab: 'post',
    isUploading: false,
    textColor: '#000000',
    bgColor: '#fff',
    bgColor2: '#fff',
    percentage: '0',
    percentage2: '100',
    angle: 90,
};

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
        },
        setPlanType: (state, action: PayloadAction<'free' | 'premium'>) => {
            state.planType = action.payload;
        },
        tokenIncrement: (state, action: PayloadAction<number>) => {
            state.tokens += action.payload;
        },
        tokenDecrement: (state, action: PayloadAction<number>) => {
            state.tokens -= action.payload;
        },
        setText: (state, action: PayloadAction<string>) => {
            state.text = action.payload;
        },
        setFont: (state, action) => {
            state.font = action.payload;
        },
        setFontSize: (state, action) => {
            state.fontSize = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setIsUploading: (state, action) => {
            state.isUploading = action.payload;
        },
        setTextColor: (state, action) => {
            state.textColor = action.payload;
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
        resetState: () => initialState,
    },
});

export const { 
    toggleDarkMode,
    setPlanType, 
    tokenIncrement,
    tokenDecrement,
    setText,
    setFont,
    setFontSize,
    setActiveTab,
    setIsUploading,
    setTextColor,
    setBgColor,
    setBgColor2,
    setPercentage,
    setPercentage2,
    setAngle } = uiSlice.actions;


export default uiSlice.reducer;