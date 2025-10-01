import React from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"

function Provider({
    children,
  ...props
}) {
  return (
    <NextThemesProvider 
        attribute="class"
        defaultTheme="sysytem"
        enableSystem
        disableTransitionOnChange
        {...props}>
        <div>{children}</div>
    </NextThemesProvider>
  )
}

export default Provider