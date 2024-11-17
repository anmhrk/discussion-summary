import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CSPostHogProvider } from "./_analytics/providers";
import { Navbar } from "./_components/navbar";
import { ConvexClientProvider } from "@/components/convex-provider";

export const metadata: Metadata = {
  title: "Human Event Discussion Summarizer",
  description: "Generate summaries of Human Event discussion posts in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <CSPostHogProvider>
        <body className="antialiased">
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
