import { ProductCategoryApiType } from "@model/products";
import { isStrapiSuccessResponseProducts, StrapiResponseProducts } from "@model/strapi-api";
import { IClient, RequestOptions } from "./types";
import formateError from "./utils/formate-error";

export default class CategoriesApi {
    private client: IClient;
    private populate = ['image'];
    private path = {
        list: '/product-categories'
    }
    
    constructor(client: IClient) {
        this.client = client;
    }

    getCategories = async ({ signal, next }: RequestOptions) => {
        try {
            const response = await this.client.get<StrapiResponseProducts<ProductCategoryApiType[]>>(
                this.path.list,
                { signal }
            );

            if (!isStrapiSuccessResponseProducts(response)) {
                throw new Error(response.error.message);
            }

            return response;

        } catch (err) {
            throw formateError(err);
        }
    }
}