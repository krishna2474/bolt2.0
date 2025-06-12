import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "./themeProvider";
export const metadata = {
  title: "Bolt 2.0",
  description: "Prompt, Run, Edit and Deploy Full-Stack Web Apps",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
