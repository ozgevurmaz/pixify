import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as fabric from 'fabric';

export interface InitialStateTypes {
    canvas: fabric.Canvas | null;
    isInitialized: boolean;
}

const initialState: InitialStateTypes = {
    canvas: null,
    isInitialized: false,
};

export const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        setCanvas: (state, action: PayloadAction<fabric.Canvas>) => {
            state.canvas = action.payload;
            state.isInitialized = true;
        },
        resetCanvas: (state) => {
            state.canvas = null;
            state.isInitialized = false;
        },
    },
});

export const {
    setCanvas,
    resetCanvas,
} = canvasSlice.actions;

export default canvasSlice.reducer;
