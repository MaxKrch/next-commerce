import Text from "@components/Text";
import style from './about.module.scss'
import clsx from "clsx";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "О нас",
  description: "Онлайн-магазин бесполезных товаров",
}

export default function AboutPage () {
    return(
        <article className={clsx(style['about'])}>
            <Text className={clsx(style['about__title'])}>
                Добро пожаловать в наш онлайн-магазин!
            </Text>
             <Text  className={clsx(style['about__description'])}>
                В нём вы найдёте всё — от «того, чего нет», до «того, что пока только в коде».
            </Text> 
            <Text className={clsx(style['about__description'])}>
                Возможно, однажды тут появится настоящий товар (нет...)
            </Text>
            <Text className={clsx(style['about__description'])}>
                До встречи!
            </Text>
        </article>
    )
}

