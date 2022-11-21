import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/model/cart-item';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  items: CartItem[] =[];
  totalQuantity: number = 0;
  totalPrice: number = 0;
  pulldownNums: number[] = [...Array(100).keys()];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {

    this.fetchCartItems();

  }

  fetchCartItems() {
    this.items = this.cartService.cartItems;

    this.cartService.totalQuantity$.subscribe( q =>
       this.totalQuantity = q
    )

    this.cartService.totalPrice$.subscribe( p =>
       this.totalPrice = p
    )
  }

  incrementQuantity(item: CartItem){
    this.cartService.addCartItem(item);
  }

  decrementQuantity(item: CartItem){
    this.cartService.decrementCartItem(item);
  }

  removeItem(item: CartItem){
    this.cartService.removeCartItem(item);
  }
}
