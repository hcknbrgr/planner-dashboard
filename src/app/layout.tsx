import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./style.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LLM Todo List",
  description: "A simple UI to assist with todo lists",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="menu-container">{children}</main>
      </body>
    </html>
  );
}
