import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CSPostHogProvider } from "./_analytics/providers";
import { Navbar } from "../components/common/navbar";
import { ConvexClientProvider } from "@/components/convex-provider";
import { Footer } from "@/components/common/footer";

export const metadata: Metadata = {
  title: "Canvas Discussion Summarizer",
  description: "Generate summaries of Human Event discussion boards in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <CSPostHogProvider>
        <body className="antialiased min-h-screen flex flex-col">
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <div className="flex-grow flex flex-col">{children}</div>
              <Footer />
              <Toaster richColors />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
