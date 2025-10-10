import type { Metadata } from "next"
import "./globals.css"
import { ViewTransitions } from "next-view-transitions"
import { ThemeProvider } from "@/components/ui/theme-provider"
import Navigation from "@/components/ui/navigation"
import Footer from "@/components/ui/footer"

export const metadata: Metadata = {
  title: "Finly: Stock Quotes, Market News, & Analysis",
  description:
    "Finly is a source of free stock quotes, business and finance news, portfolio management tools, and international market data.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className="min-h-screen bg-background pb-6 font-sans antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            <main className="container">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
