import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import "@style/main.scss";
import Provider from "./providers";


const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Next-commerсe - милион бесполезных товаров для вас",
  description: "Ваши деньги - наша прибыль!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
