import { QueryParams } from "@model/query-params";
import { ProductsStoreProvider } from "../providers/ProductsStoreProvider";
import ProductsApi from "@api/ProductsApi";
import Client from "@api/client";

import { isStrapiSuccessResponseProducts, MetaResponse, StrapiResponseProducts } from "@model/strapi-api";
import { ProductsInitData } from "@store/local/ProductsStore/ProductsStore";
import SectionHeader from "@components/SectionHeader";
import ProductList from "./components/ProductList";
import qs from "qs";
import ProductPagination from "./components/ProductPagination";
import ProductSearch from "./components/ProductSearch";

export const textdata = {
  title: "Товары",
  description: [
    'Мы собрали для вас самые горячие новинки сезона',
    'Если ищите что-то конкретное - просто нанчните вводить название'
  ]
}   

export const metadata = {
  title: "Список товаров",
  description: "Каталог самых горячих новинок сезона - тысячи товаров для вас",
}

type ProductsPageProps = {
    searchParams: Promise<QueryParams>
}

export default async function ProductsPage ({searchParams}: ProductsPageProps) {
    let initData: ProductsInitData; 

    const params = await searchParams;
    const productsApi = new ProductsApi(new Client);
    const queryString = qs.stringify(params, { arrayFormat: 'repeat' });
    try {
        const response = await productsApi.getProductList(params, {})
        
        if(!isStrapiSuccessResponseProducts(response)) {
            throw response;
        }

        initData = {
            success: true,
            query: queryString,
            products: response.data,
            meta: response.meta,            
        }

    } catch(err) {
        initData = {
            success: false,
            query: queryString,
            error: err instanceof Error ? err.message : "UnknownError"
        }
    }
    
    return (
        <div>
            <ProductsStoreProvider>
                <SectionHeader title={textdata.title} content={textdata.description} />
                <ProductSearch />
                <ProductList initData={initData}/>
                <ProductPagination />
            </ProductsStoreProvider>
        </div>
    );
};

