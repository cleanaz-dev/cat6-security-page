"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ 
  children,
}) {
  return (
    <NextThemesProvider 
      attribute="data-theme"
      disableTransitionOnChange
      defaultTheme="light"
    >
      {children}
    </NextThemesProvider>
  )
}