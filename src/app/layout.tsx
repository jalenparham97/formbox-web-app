import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/libs/auth";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { COMPANY_NAME } from "@/utils/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: COMPANY_NAME,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className="h-full w-full">
      <body className={`font-sans ${inter.variable} h-full`}>
        <SessionProvider session={session}>
          <NextTopLoader showSpinner={false} color="#000" />
          <Toaster />
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
