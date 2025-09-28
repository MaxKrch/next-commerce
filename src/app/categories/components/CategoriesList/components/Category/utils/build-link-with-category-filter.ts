import { ProductCategoryType } from "@model/products";
import Category from "../Category";
import { appRoutes } from "@constants/app-routes";

const buildLinkWithCategoryFilter = (id: ProductCategoryType['id']): string => {
    return `${appRoutes.products.list.create()}?categories=${id}`
} 

export default buildLinkWithCategoryFilter;