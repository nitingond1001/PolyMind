"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { AISelectedModelContext } from '@/context/AISelectedModelContext'
import { DefaultModel } from '@/shared/AIModelsShared'
import { UserDetailContext } from '@/context/UserDetailContext'

function Provider({ children, ...props }) {

  const { user } = useUser();
  const [aiSelectedModels, setAISelectedModels] = useState(DefaultModel);
  const [userDetail, setUserDetail] = useState();
  useEffect(() => {
    if (user) {
      CreateNewuser();
    }
  }, [user])
  const CreateNewuser = async () => {
    // If user exist?
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log('Existing User');
      const userInfo = userSnap.data();
      setAISelectedModels(userInfo?.selectedModelPref);
      setUserDetail(userInfo);
      return;
    } else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg: 5,
        plan: 'Free',
        credits: 1000
      }
      await setDoc(userRef, userData);
      console.log('New User data saved');
      setUserDetail(userData);
    }

    // If not then insert
  }
  return (
    <NextThemesProvider {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <AISelectedModelContext.Provider value={{ aiSelectedModels, setAISelectedModels }}>
          <SidebarProvider>
            <AppSidebar />

            <div className='w-full'>
              <AppHeader />{children}</div>
          </SidebarProvider>
        </AISelectedModelContext.Provider>
      </UserDetailContext.Provider>
    </NextThemesProvider>
  )
}

export default Provider