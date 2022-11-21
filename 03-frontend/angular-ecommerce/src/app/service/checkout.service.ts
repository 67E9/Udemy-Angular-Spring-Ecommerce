import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CheckoutComponent } from '../components/checkout/checkout.component';
import { PaymentInfo } from '../model/payment-info';
import { Purchase } from '../model/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  checkoutUrl = `${environment.luv2ShopApiUrl}/checkout/purchase`;
  paymentIntentUrl = `${environment.luv2ShopApiUrl}/checkout/payment-intent`

  constructor(private http: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any>{
    return this.http.post(this.checkoutUrl, purchase)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse, caught: Observable<any>) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      alert('A client side error occurred');
      console.error('An client side error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      alert('A backend side error occurred');
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    //this part is just a dummy and needs to be changed
    alert("And error has occured. Please try again later.") //inform user
    throw new Error(error.error); //throw new error
    return of(error.error); //return observable to satisfy typescript for catchError
  }

  createPaymentIntent(paymentInfo: PaymentInfo):Observable<any>{
    return this.http.post(this.paymentIntentUrl, paymentInfo);
  }

}
