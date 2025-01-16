import { fonts } from "@/lib/constants/font";
import { templates } from "@/lib/constants/template";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
    text: string;
    font: Font;
    fontSize: number;
    textColor: string;

    activeTab: 'post' | 'story' | 'reel';
    template: Template;
    bgColor: string;
    bgColor2: string;
    percentage: number;
    percentage2: number;
    angle: number;
    url: string;
    dimensions: Dimensions;

    isUploading: boolean;
}

interface Dimensions {
    width: number;
    height: number;
    aspectRatio: "square" | "portrait";
    maxChars: number;
}

const initialState = {
    text: "",
    font: fonts[0],
    fontSize: 30,
    textColor: '#000000',

    activeTab: 'post',
    template: templates[0],
    bgColor: '#fff',
    bgColor2: '#fff',
    percentage: '0',
    percentage2: '100',
    angle: 90,
    url: "https://images.pexels.com/photos/586687/pexels-photo-586687.jpeg?auto=compress&cs=tinysrgb&w=600",

    dimensions: {
        width: 604,
        height: 604,
        aspectRatio: "square",
        maxChars: 100,
    },

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
        setUrl: (state, action) => {
            state.url = action.payload;
        },
        setIsUploading: (state, action) => {
            state.isUploading = action.payload;
        },
        setDimensions: (state, action) => {
            state.dimensions = action.payload;
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
    setUrl,
    setIsUploading,
    setDimensions
} = postSlice.actions;


export default postSlice.reducer;