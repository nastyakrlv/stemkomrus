import {Routes} from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {CatalogOrItemComponent} from "./catalog-or-item/catalog-or-item.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {CartComponent} from "./cart/cart.component";

export const routes: Routes = [
  {path: '', component: MainPageComponent, pathMatch: 'full', title: 'ООО «СТЭМ КОМПАНИ РУС»'},
  {path: 'cart', component: CartComponent, title: 'КОРЗИНА'},
  {path: 'catalog', component: CatalogOrItemComponent, title: 'КАТАЛОГ'},
  {path: 'catalog/:subcatalog', component: CatalogOrItemComponent, title: 'КАТАЛОГ'},
  {path: 'catalog/:subcatalog/:subcatalog', component: CatalogOrItemComponent, title: 'КАТАЛОГ'},
  {path: 'catalog/:subcatalog/:subcatalog/:subcatalog', component: CatalogOrItemComponent, title: 'КАТАЛОГ'},
  {
    path: 'catalog/:subcatalog/:subcatalog/:subcatalog/:subcatalog',
    component: CatalogOrItemComponent,
    title: 'КАТАЛОГ'
  },
  {path: '**', component: PageNotFoundComponent, title: 'СТРАНИЦА НЕ НАЙДЕНА'}
];
