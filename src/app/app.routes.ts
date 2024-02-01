import {Routes} from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {CatalogOrItemComponent} from "./catalog-or-item/catalog-or-item.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {CartComponent} from "./cart/cart.component";

export const routes: Routes = [
  {path: '', component: MainPageComponent, pathMatch: 'full'},
  {path: 'cart', component: CartComponent},
  {path: 'catalog', component: CatalogOrItemComponent},
  {path: 'catalog/:subcatalog', component: CatalogOrItemComponent},
  {path: 'catalog/:subcatalog/:subcatalog', component: CatalogOrItemComponent},
  { path: '**', component: PageNotFoundComponent }
];
