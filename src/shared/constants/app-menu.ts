import { appRoutes } from './app-routes';

const AppMenu = [
  {
    title: 'Товары',
    path: appRoutes.products.list.create(),
  },
  {
    title: 'Категории',
    path: appRoutes.categories.create(),
  },
  {
    title: 'О нас',
    path: appRoutes.about.create(),
  },
] as const;

export default AppMenu;
