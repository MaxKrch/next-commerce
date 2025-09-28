import clsx from "clsx";
import style from './app.module.scss'
import Text from "@components/Text";
import Image from "next/image";
import Button from "@components/Button";
import { Metadata } from "next";
import Link from "next/link";
import { appRoutes } from "@constants/app-routes";

export const metadata: Metadata = {
  title: "Страница 404",
}

export default function NotFoundPage () {
    return(
        <article className={clsx(style['error'])}>
            <header className={clsx(style['error__header'])}>
                <Text view="title">
                    Кажется, страницу кто-то похитил!
                </Text> 
            </header>
            <main className={clsx(style['error__body'])}>
                <div className={clsx(style['error__image-container'])}>
                    <Image
                        src='/not-found.png'
                        priority
                        sizes="(max-width: 768px) 100vw, 768px" 
                        fill
                        alt='notFound'
                        className={clsx(style['error__image'])}
                    />
                </div>
                <Text className={clsx(style['error__description'])}>
                    Либо вам отправили сломанную сслыку  
                </Text>
                <Text className={clsx(style['error__description'])}>
                    Хотите продолжить выбор товаров для себя?
                </Text>
            </main>
            <footer className={clsx(style['error__footer'])}>
                <Button className={clsx(style['error__button'])}>
                    <Link href={appRoutes.products.list.create()}>
                        Да, хочу!   
                    </Link> 
                </Button>
            </footer>            
        </article>
    )
}

