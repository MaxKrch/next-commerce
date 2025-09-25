"use client"

import { useQueryParamsSync } from "@store/global/QueryParams";
import { PropsWithChildren } from "react";
import { useRootStore } from "./root-store-context";

export const QueryParamsStoreProvider: React.FC<PropsWithChildren> = ({children}) => {
    const { queryParamsStore } = useRootStore() 
    useQueryParamsSync(queryParamsStore)
    return(
        <>
            {children}
        </>        
    )
}
