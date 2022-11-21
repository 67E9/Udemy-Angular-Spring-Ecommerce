import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/model/order-history';
import { OrderHistoryService } from 'src/app/service/order-history-service.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  public orderHistory: OrderHistory[] = [];
  private storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory()
  }

  handleOrderHistory() {
    
    const userEmail = JSON.parse(this.storage.getItem("userEmail")!);

    if (userEmail){
      this.orderHistoryService.getOrderHistoryByEmail(userEmail).subscribe(
        res => this.orderHistory = res
      )
    }
  }
}
