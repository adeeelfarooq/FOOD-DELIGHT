import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import { Providers } from "./providers"
import BottomNavigator from "@/components/bottom-navigator"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "FOOD DELIGHT",
  description: "A modern food ordering application",
    generator: 'v0.dev',
    icons: {
    icon: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  },
}

export default function RootLayout({
  children,
}) {
  // @ts-ignore - children prop type issue
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Providers>
              {children}
              <BottomNavigator />
              <Toaster />
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
