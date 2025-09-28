"use client"

import QueryParamsStore from "./QueryParamsStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { reaction } from "mobx";

const useQueryParamsSync = (store: QueryParamsStore) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryString = searchParams.toString()

    useEffect(() => {
        store.setFromSearchParams(searchParams)
    }, [searchParams, queryString, store]);

    useEffect(() => {
        const dispose = reaction(
            () => store.queryString,
            newQuery => {
                const currentQuery = searchParams.toString();
                if(newQuery === currentQuery) {
                    return;
                }
                const href = newQuery ? `?${newQuery}` : '/';
                router.replace(href)
            },
            { fireImmediately: false }
        )
        return () => dispose()
    }, [queryString, searchParams, store, router])
}

export default useQueryParamsSync