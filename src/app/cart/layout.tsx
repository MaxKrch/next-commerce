import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Корзина товаров",
    description: "Оформление в два клика, бесплтаная доставка - от трех часов",
}

export default function CartLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
