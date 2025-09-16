import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider } from "@/components/theme-provider";
import PWAInstaller from "@/components/PWAInstaller";
import ConditionalNav from "@/components/navigation/conditional-nav";
import LoadingMonitor from "@/components/performance/loading-monitor";
import { Toaster } from "@/components/ui/toaster";
import "../styles/globals.css";

// Use system fonts as fallback for build reliability
const fontVariables = {
  "--font-inter": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  "--font-dm-sans": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
};

export const metadata: Metadata = {
  title: "IBIAS - AI-Powered Business Intelligence for SMBs",
  description: "Transform your business data into actionable insights with IBIAS, the AI-powered analytics platform designed for small to mid-sized businesses.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IBIAS",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "IBIAS",
    title: "IBIAS - AI-Powered Business Intelligence",
    description: "Transform your business data into actionable insights with AI-powered analytics.",
  },
  twitter: {
    card: "summary",
    title: "IBIAS - AI-Powered Business Intelligence",
    description: "Transform your business data into actionable insights with AI-powered analytics.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className="font-sans antialiased"
        style={fontVariables as React.CSSProperties}
      >
        <LoadingMonitor>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="ibias-theme"
          >
            <AuthProvider>
              <SubscriptionProvider>
                <ConditionalNav />
                <main className="relative">
                  {children}
                </main>
                <PWAInstaller />
                <Toaster />
              </SubscriptionProvider>
            </AuthProvider>
          </ThemeProvider>
        </LoadingMonitor>
      </body>
    </html>
  );
}
