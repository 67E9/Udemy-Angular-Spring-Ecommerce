import { Injectable } from '@angular/core';
import { CartItem } from '../model/cart-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  //persisted using session storage (deleted on closing browser)
  storage: Storage = sessionStorage; //access browser's session storage api
  //persisted using local storage (not deleted on closing browser)
  //storage: Storage = localStorage; //access browser's session storage api

  cartItems: CartItem[] = [];
  totalQuantity$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(){

    //retrieve pre-existing cart items from this session on reload or login
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data){
      this.cartItems = data;
      this.recalculateTotals();
    }

  }

  addCartItem(newCartItem: CartItem){
    let alreadyExistsInCart = false;
    let existingCartItem: CartItem|undefined = undefined;

    //check if item is already in cart
    
      //find item in cart based on id

    existingCartItem = this.cartItems.find( item =>
      item.id === newCartItem.id
    )
      //check if we found it 
    alreadyExistsInCart = existingCartItem ? true: false;
      
    if (alreadyExistsInCart){
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(newCartItem);
    }

    this.recalculateTotals();
  }

  decrementCartItem(itemToDecrement: CartItem) {
      itemToDecrement.quantity--

      if (itemToDecrement.quantity === 0){
        this.removeCartItem(itemToDecrement)
        return;
      }
      
      this.recalculateTotals();
  }

  removeCartItem(itemToRemove: CartItem){
    let itemIndex = this.cartItems.findIndex(cartItem => cartItem.id === itemToRemove.id);
    this.cartItems.splice(itemIndex, 1);
    this.recalculateTotals();
  }

  recalculateTotals(){
        //calculate new totals 
        let newTotalPrice = 0;
        let newTotalQuantity = 0;
        this.cartItems.forEach( item =>
          {
            newTotalPrice += item.unitPrice * item.quantity
            newTotalQuantity += item.quantity
          }
        )
        //push observables
        this.totalPrice$.next(newTotalPrice);
        this.totalQuantity$.next(newTotalQuantity);
    
        this.persistCartItems();
        this.logShoppingCart(this.cartItems, newTotalPrice, newTotalQuantity);
  }

  logShoppingCart(cartItems: CartItem[], newTotalPrice: number, newTotalQuantity: number) {
    console.log("Shopping Cart Content:")
    cartItems.forEach( item =>
      console.log(`Item: ${item.name}, Price: $${item.unitPrice}, Quantity: ${item.quantity}, Subtotal: $${(item.quantity*item.unitPrice).toFixed(2)}`)
    );
    console.log("TOTALS:");
    console.log(`Total_Items: ${newTotalQuantity}, Total_Price: $${newTotalPrice.toFixed(2)}`);
    console.log("-----");
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

}