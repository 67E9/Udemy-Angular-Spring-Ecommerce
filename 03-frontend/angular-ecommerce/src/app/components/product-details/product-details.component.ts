import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/model/cart-item';
import { Product } from 'src/app/model/product';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
    ) { }

  ngOnInit(): void {
    
    this.fetchProduct();

  }

  fetchProduct() {
    this.product = undefined;
    let productId = Number(this.route.snapshot.paramMap.get('id'))
    this.productService.fetchProduct(productId).subscribe(
      p =>
        {
          this.product = p;
        }, 
      err => 
        {
          console.log(err);
          this.router.navigateByUrl('/category/1');
        }
    )
  }

  addToCart(){
    this.cartService.addCartItem(new CartItem(this.product!));
  }

}
