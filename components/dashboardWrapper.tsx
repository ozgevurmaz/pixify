"use client"

import React, { useEffect } from 'react'

import { Provider, useSelector } from 'react-redux';
import store, { persistor, RootState } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const isDarkMode = useSelector((state: RootState) => state.user.isDarkMode);


    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    })

    return (
        <main className={`flex w-full flex-col bg-gray-50 dark:text-white dark:bg-colors-dark-bg}`}>
            {/* App Content */}
            {children}
        </main>
    )
}

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <DashboardLayout>
                    {children}
                </DashboardLayout>
            </PersistGate>
        </Provider>
    )
}

export default DashboardWrapper