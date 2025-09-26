"use client"

import useLocalStore from "@store/hooks/useLocalStore"
import ProductsStore from "@store/local/ProductsStore/ProductsStore"
import React, { createContext, PropsWithChildren, useRef } from "react"
import { useRootStore } from "./RootStoreContext"
import { useStrictContext } from "@hooks/useSctrictContext"

const ProductsContext = createContext<ProductsStore | null>(null)

export const ProductsStoreInnerProvider: React.FC<PropsWithChildren> = ({children}) => {
    const rootStore = useRootStore()
    const store = useLocalStore(() => new ProductsStore({
        rootStore
    }))

    return(
        <ProductsContext.Provider value={store}>
            {children}
        </ProductsContext.Provider>
    ) 
}

export const ProductsStoreProvider: React.FC<PropsWithChildren> = ({children}) => {
    return(
        <ProductsStoreInnerProvider>
            {children}
        </ProductsStoreInnerProvider>
    ) 
}

export const useProductsStore = () => useStrictContext({
    context: ProductsContext,
    message: "ProductsContext was not provided"
})