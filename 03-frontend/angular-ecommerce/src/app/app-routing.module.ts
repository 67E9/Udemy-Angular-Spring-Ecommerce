import { Injector, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';

//below inmports are required for login with embedded okta-widget
import {
  OktaAuthGuard,
  OktaCallbackComponent
} from '@okta/okta-angular'
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OktaAuth } from '@okta/okta-auth-js';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const routes: Routes = [
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard], 
    data: {onAuthRequired: sendToLoginPage}},
  {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard], 
    data: {onAuthRequired: sendToLoginPage}},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', redirectTo: '/category/1', pathMatch: 'full'},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'products', redirectTo: '/category/1', pathMatch: 'full'},
  {path: '', redirectTo: '/category/1', pathMatch: 'full'},
  {path: '**', redirectTo: '/category/1', pathMatch: 'full'},
];

function sendToLoginPage( oktaAuth: OktaAuth, injector: Injector ){
  const router: Router = injector.get(Router) //get router service via the injector
  router.navigate(['login']) // navigate to custom login page
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
