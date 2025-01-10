import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
    isDarkMode: boolean;
    planType: 'free' | 'premium';
    tokens: number;
}

const initialState = {
    isDarkMode: false,
    planType: 'free',
    tokens: 2,
};

export const userSlice = createSlice({
    name: "user",
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
        
    },
});

export const { 
    toggleDarkMode,
    setPlanType, 
    tokenIncrement,
    tokenDecrement,
    } = userSlice.actions;


export default userSlice.reducer;