import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CSPostHogProvider } from "./_analytics/providers";
import { ConvexClientProvider } from "@/components/convex-provider";

export const metadata: Metadata = {
  title: "Canvas Discussion Summarizer",
  description: "Generate summaries of Human Event discussion boards in seconds",
};

export default function RootLayout({
  children,
  discussion,
}: Readonly<{
  children: React.ReactNode;
  discussion: React.ReactNode;
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
              {children}
              {discussion}
              <Toaster richColors />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
