import { META_STATUS } from '@constants/meta-status';
import { DEFAULT_SORT, SORT_OPTIONS, SortOption, SortType } from '@constants/product-sort';
import { Option } from '@model/option-dropdown';
import { ProductCategoryType } from '@model/products';
import { QueryParams } from '@model/query-params';
import { ILocalStore } from '@store/hooks/useLocalStore';
import RootStore from '@store/RootStore/RootStore';

import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  type IReactionDisposer,
} from 'mobx';

type PrivateFields =
  | '_inputValue'
  | '_selectedCategories'
  | '_activeSort'
  | '_inStock'
  | '_cleanupSelectedCategories'
  | '_initFromQueryParamsStore'
  | '_resetQuery'

export default class SearchStore implements ILocalStore {
  private _rootStore: RootStore;
  private _inputValue: string = '';
  private _selectedCategories: ProductCategoryType['id'][] = [];
  private _debounce: ReturnType<typeof setTimeout> | null = null;
  private _handleChange: (params: QueryParams) => void;
  private _inStock: boolean = false;
  private _activeSort: SortType = DEFAULT_SORT;
  reactions: IReactionDisposer[] = [];

  constructor({
    handleChange,
    rootStore,
  }: {
    handleChange: (params: QueryParams) => void;
    rootStore: RootStore;
  }) {
    makeObservable<SearchStore, PrivateFields>(this, {
      _inputValue: observable,
      _selectedCategories: observable,
      _activeSort: observable,
      _inStock: observable,

      changeInput: action.bound,
      selectCategories: action.bound,
      setActiveSort: action.bound,
      setInStock: action.bound,

      _resetQuery: action,
      _initFromQueryParamsStore: action,
      _cleanupSelectedCategories: action,

      inputValue: computed,
      inStock: computed,

      sortOptions: computed,
      activeSort: computed,

      selectedCategories: computed,
      categoriesOptions: computed,
      categoriesValue: computed,
      titleCategoriesValue: computed,
    });

    this._handleChange = handleChange;
    this._rootStore = rootStore;
    this.initReactions();
    this._initFromQueryParamsStore();
  }

  initReactions(): void {
    const reactionLoadCategories = reaction(
      () => this._rootStore.categoriesStore.list,
      (categories) => {
        if (
          this._rootStore.categoriesStore.status !== META_STATUS.SUCCESS ||
          categories.length === 0
        ) {
          return;
        }

        this._cleanupSelectedCategories(categories);
      }
    );
    this.reactions.push(reactionLoadCategories)
    
    const reactionChangeInput = reaction(
      () => this._rootStore.queryParamsStore.query,
      (query) => {
        if(query !== this._inputValue) {
          this._inputValue = query ?? ''
        }
      }
    )
    this.reactions.push(reactionChangeInput);

    const reactionChangeCategories = reaction(
      () => this._rootStore.queryParamsStore.categories,
      (categories) => this._selectedCategories = categories ?? [],
    )
    this.reactions.push(reactionChangeCategories)

    const reactionChangeInStock = reaction(
      () => this._rootStore.queryParamsStore.inStock,
      (inStock) => this._inStock = inStock ?? false,
    )
    this.reactions.push(reactionChangeInStock)

    const reactionChangeSort = reaction(
      () => this._rootStore.queryParamsStore.sort,
      (sort) => this._activeSort = sort ?? DEFAULT_SORT,
    )
    this.reactions.push(reactionChangeCategories)
  }


  get categoriesOptions(): Option[] {
    return this._rootStore.categoriesStore._list.order.map(id => ({
      key: `${id}`,
      value: this._rootStore.categoriesStore._list.entities[id]?.title,
    }))
  }

  get categoriesValue(): Option[] {    
    return this._selectedCategories.map(id => ({
      key: `${id}`,
      value: this._rootStore.categoriesStore._list.entities[id]?.title,
    }))
  }

  get titleCategoriesValue(): string {
    if (this.categoriesValue.length > 0) {
      return this.categoriesValue.map((item) => item.value).join(', ');
    }

    return 'Любая категория';
  }

  get inputValue(): string {
    return this._inputValue;
  }

  get selectedCategories(): ProductCategoryType['id'][] {
    return this._selectedCategories;
  }

  get inStock(): boolean {
    return this._inStock;
  }

  get sortOptions(): Option[] {
    return Object.values(SORT_OPTIONS).map(item => ({
      key: item.key,
      value: item.label
    }))
  }

  get activeSort(): SortOption {
    return SORT_OPTIONS[this._activeSort];
  } 

  _resetQuery(): void {
    if (this._debounce) {
      clearTimeout(this._debounce);
      this._debounce = null;
    }

    this._rootStore.queryParamsStore.mergeQueryParams({
      query: '',
      categories: []
    });
  }

  changeInput(value: string): void {
    if (this._debounce) {
      clearTimeout(this._debounce);
    }
    this._inputValue = value;
    this._debounce = setTimeout(
      () => this._rootStore.queryParamsStore.mergeQueryParams({
        query: value,
      }),
      1000
    );
  }

  selectCategories(options: Option[]): void {    
    if (this._rootStore.categoriesStore.status !== META_STATUS.SUCCESS) {
      return;
    }
    
    const selected: ProductCategoryType['id'][] = [];
    
    options.forEach((item) => {
      const categoriesId = Number(item.key)
    
      if (this._rootStore.categoriesStore._list.order.includes(categoriesId)) {
        selected.push(categoriesId);
      };
    });
    
    this._rootStore.queryParamsStore.mergeQueryParams({
      categories: selected,
    })
  }

  setInStock(value: boolean): void {
    this._rootStore.queryParamsStore.mergeQueryParams({
      inStock: value,
    })
  }

  setActiveSort(value: SortType): void {
    this._rootStore.queryParamsStore.mergeQueryParams({
      sort: value,
    })
  }
 
  private _initFromQueryParamsStore(): void {
    this._inputValue = this._rootStore.queryParamsStore.query ?? '';
    this._selectedCategories = this._rootStore.queryParamsStore.categories ?? []
  }

  private _cleanupSelectedCategories(categories: ProductCategoryType[]): void {
    const cleanCategories = categories
      .filter((item) => this._selectedCategories.includes(item.id))
      .map(item => item.id);

    this._selectedCategories = cleanCategories;
  }

  clearReactions(): void {
    this.reactions.map(item => item());
    this.reactions = []
  }

  destroy(): void {
    if (this._debounce) {
      clearTimeout(this._debounce);
    }
  }
}
