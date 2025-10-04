import { SortKeys } from "@constants/product-sort";
import { ProductType } from "@model/products";

const sortProducts = (products: ProductType[], sort: SortKeys) => {
    const cloned = [...products]
    switch(sort) {
        case 'newest':
            return cloned.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

        case 'discount':
            return cloned.sort((a, b) => b.discountPercent - a.discountPercent);

        case 'popular':
            return cloned.sort((a, b) => b.rating - a.rating);

        case 'price_asc':
            return cloned.sort((a, b) => a.price - b.price);

        case 'price_desc':
            return cloned.sort((a, b) => b.price - a.price);
            
        default:
            return products;
    }
}

export default sortProducts;