import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPageComponent } from '@modules/products/feature/product-page.component';
import { environment } from '@environments/environment.prod';

const appName = environment.name;

const routes: Routes = [
  { path: '', component: ProductPageComponent, title: 'Product - ' + appName, canActivate: []},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
