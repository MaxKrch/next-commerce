"use client"

import useLocalStore from "@store/hooks/useLocalStore"

import React, { createContext, PropsWithChildren } from "react"
import { useRootStore } from "./RootStoreContext"
import { useStrictContext } from "@hooks/useSctrictContext"
import ProductDetailsStore from "@store/local/ProductDetailsStore"

const ProductDetailsContext = createContext<ProductDetailsStore | null>(null)

const ProductDetailsStoreInnerProvider: React.FC<PropsWithChildren> = ({children}) => {
    const rootStore = useRootStore()
    const store = useLocalStore(() => new ProductDetailsStore({
        rootStore
    }))

    return(
        <ProductDetailsContext.Provider value={store}>
            {children}
        </ProductDetailsContext.Provider>
    ) 
}

export const ProductDetailsStoreProvider: React.FC<PropsWithChildren> = ({children}) => {
    return(
        <ProductDetailsStoreInnerProvider>
            {children}
        </ProductDetailsStoreInnerProvider>
    ) 
}

export const useProductDetailsStore = () => useStrictContext({
    context: ProductDetailsContext,
    message: "ProductDetyailsContext was not provided"
})