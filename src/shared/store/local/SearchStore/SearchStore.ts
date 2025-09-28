import { META_STATUS } from '@constants/meta-status';
import { Collection } from '@model/collections';
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
  | '_filterSelectedCategories'
  | '_setInitData'

export default class SearchStore implements ILocalStore {
  private _inputValue: string = '';
  private _selectedCategories: ProductCategoryType['id'][] = [];
  private _debounce: ReturnType<typeof setTimeout> | null = null;
  private _handleChange: (params: QueryParams) => void;
  private _rootStore: RootStore;
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

      changeInput: action.bound,
      selectCategories: action.bound,
      resetValues: action.bound,

      _setInitData: action,
      _filterSelectedCategories: action,

      inputValue: computed,
      selectedCategories: computed,
      categoriesOptions: computed,
      categoriesValue: computed,
      titleCategoriesValue: computed,
    });

    this._handleChange = handleChange;
    this._rootStore = rootStore;
    this.initReactions();
    this._setInitData();
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

        this._filterSelectedCategories(categories);
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
  }

  private _setInitData(): void {
   
    this._inputValue = this._rootStore.queryParamsStore.query ?? '';
    this._selectedCategories = this._rootStore.queryParamsStore.categories ?? []
  }

  private _filterSelectedCategories(categories: ProductCategoryType[]): void {
    const filtredCategories = categories
      .filter((item) => this._selectedCategories.includes(item.id))
      .map(item => item.id);

    this._selectedCategories = filtredCategories;
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

  resetValues(): void {
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
