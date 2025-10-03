import React from 'react'
import style from './ProductSort.module.scss'
import clsx from 'clsx'

export type ProductSortProps = {

}
const ProductsSort: React.FC<ProductSortProps> = ({}) => {
    return (
        <div className={clsx(style['sort'])}>
            {/* <MultiDropdown

            /> */}sort
        </div>
    )
}

export default ProductsSort;