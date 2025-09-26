import { QueryParams } from "@model/query-params";
import { action, computed, makeObservable, observable } from "mobx";
import { ReadonlyURLSearchParams } from "next/navigation";
import qs from "qs";

type PrivateFields = 
    | '_categories'
    | '_query'
    | '_inStock'
    | '_sort'
    | '_count'
    | '_page'
    | '_setQueryParams'

export default class QueryParamsStore {
    private _page: QueryParams['page'] = undefined;
    private _count: QueryParams['count'] = undefined;
    private _categories: QueryParams['categories'] = undefined;
    private _query: QueryParams['query'] = undefined;
    private _sort: QueryParams['sort'] = undefined;
    private _inStock: QueryParams['inStock'] = undefined;

    constructor() {
        makeObservable<QueryParamsStore, PrivateFields>(this, {
            _categories: observable,
            _query: observable,
            _inStock: observable,
            _sort: observable,
            _count: observable,
            _page: observable,

            categories: computed,
            query: computed,
            inStock: computed,
            sort: computed,
            count: computed,
            page: computed,
            
            queryObject: computed,
            queryString: computed,

            _setQueryParams: action.bound,
            resetQueryParams: action.bound
        })
    }

    get categories(): QueryParams['categories'] {
        return this._categories;
    }

    get query(): QueryParams['query'] {
        return this._query;
    }

    get sort(): QueryParams['sort'] {
        return this._sort;
    }

    get inStock(): QueryParams['inStock'] {
        return this._inStock;
    }

    get count(): QueryParams['count'] {
        return this._count;
    }   

    get page(): QueryParams['page'] {
        return this._page;
    }

    get queryObject(): QueryParams {
        const queryParams: QueryParams = {};

        if(this._categories) {
            queryParams.categories = this._categories;
        }

        if(this._query) {
            queryParams.query = this._query;
        }

        if(this._inStock) {
            queryParams.inStock = this._inStock;
        }

        if(this._sort) {
            queryParams.sort = this._sort;
        }

        if(this._count) {
            queryParams.count = this._count;
        }

        if(this._page) {
            queryParams.page = this._page;
        }

        return queryParams;
    }

    get queryString(): string {
        const paramsObj = this.queryObject;

        if(paramsObj.page && paramsObj.page === 1) {
            delete paramsObj.page
        }
        return qs.stringify(paramsObj, { arrayFormat: "repeat" });
    }
    
    private _setQueryParams(params: QueryParams): void {
        if(params.categories) {
            this._categories = params.categories.length > 1
                ? params.categories
                : undefined;
        }

        if(params.query) {
            this._query = params.query.length > 1
                ? params.query
                : undefined;
        }

        if(params.sort) {
            this._sort = params.sort;
        }

        if(params.inStock) {
            this._inStock = params.inStock ?? undefined;
        }

        if(params.count) {
            this._count = params.count;
        }
        
        if (params.page) {
            this._page = params.page;
        }
    }
    
    setFromSearchParams(searchParams: ReadonlyURLSearchParams | string) {
        const queryString = typeof searchParams === "string"
            ? searchParams
            : searchParams.toString();

        const params: QueryParams = qs.parse(queryString, { ignoreQueryPrefix: true });

        this.mergeQueryParams(params);
    }

    mergeQueryParams(newParams: QueryParams): void {
        const mergedParams = {...this.queryObject, ...newParams}

        this._setQueryParams(mergedParams)
    }

    resetQueryParams(): void {
        this._page = undefined;
        this._count = undefined;
        this._categories = undefined;
        this._query = undefined;
        this._sort = undefined;
        this._inStock = undefined;
    }   
}