import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { MenuClick } from "./components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Обувь в Family",
  description: "Обувь для всей семьй",
  keywords: ["обувь", "обувь в Казахстане", "обувь в Боралдай", "obuv", "obuv v boraldai"]
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <header>
      <MenuClick></MenuClick>
    </header>
    <main>{children}</main>
    <footer className="shadow bg-gray-800">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span className="text-sm  sm:text-center text-gray-400">
        © 2024 <Link href="https://flowbite.com/" className="hover:underline">Family™</Link>. All Rights Reserved.
      </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-400 sm:mt-0">
          <li>
            <Link href="#" className="hover:underline me-4 md:me-6">О нас</Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">Контакты</Link>
          </li>
        </ul>
      </div>
    </footer>

    </body>
    </html>
  );
}
