import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../model/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  orderHistoryUrl = `${environment.luv2ShopApiUrl}/orders/search/findByCustomerEmailOrderByDateCreatedDesc?email=`

  constructor(private http: HttpClient) { }

  getOrderHistoryByEmail(userEmail: string) : Observable<OrderHistory[]> {

    return this.http.get<IGetResponseOrderHistory>(this.orderHistoryUrl+userEmail)
      .pipe(
        map( res =>
          res._embedded.orders
        )
      )

  }
}

interface IGetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[]
  }
}