"use client"

import { useRouter } from "next/router";
import QueryParamsStore from "./QueryParamsStore";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { reaction } from "mobx";

const useQueryParamsSync = (store: QueryParamsStore) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        store.setFromSearchParams(searchParams)
    }, [searchParams.toString(), store]);

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
    }, [searchParams.toString(), store, router])
}

export default useQueryParamsSync