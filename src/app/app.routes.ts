import {Routes} from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {CatalogOrItemComponent} from "./catalog-or-item/catalog-or-item.component";

export const routes: Routes = [
  {path: '', component: MainPageComponent, pathMatch: 'full'},
  {path: 'catalog', component: CatalogOrItemComponent},
  {path: 'catalog/:subcatalog', component: CatalogOrItemComponent},
  {path: 'catalog/:subcatalog/:subcatalog', component: CatalogOrItemComponent}
];
