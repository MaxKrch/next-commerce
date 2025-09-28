import Client from "@api/client";
import SectionHeader from "@components/SectionHeader";
import { Metadata } from "next";
import { CategoriesInitData } from "@store/global/CategoriesStore/CategoriesStore";
import CategoriesApi from "@api/CategoriesApi";
import { isStrapiSuccessResponseProducts } from "@model/strapi-api";
import CategoriesList from "./components/CategoriesList";

export const sectionText = {
  title: "Категории",
  description: [
    'Все категории товаров нашего сайта',
    'Выберите, что вам инетресно - и наслажадйтесьь покупками!' 
  ]
}   

export const metadata: Metadata = {
  title: "Категории товаров",
  description: "Тысячи товаров каждое категории, от ярких новином до горячих хитов",
}

export default async function CategoriesPage () {
    let initData: CategoriesInitData; 

    const categoriesApi = new CategoriesApi(new Client);
  
    try {
        const response = await categoriesApi.getCategories({ next: { revalidate: 60 * 60 }})
        
        if(!isStrapiSuccessResponseProducts(response)) {
            throw response;
        }

        initData = {
            success: true,
            categories: response.data,
            meta: response.meta,            
        }

    } catch(err) {
        initData = {
            success: false,
            error: err instanceof Error ? err.message : "UnknownError"
        }
    }
    console.log(initData)
    return (
        <div>
            <SectionHeader title={sectionText.title} content={sectionText.description} />
            <CategoriesList initData={initData}/>
        </div>
    );
};

