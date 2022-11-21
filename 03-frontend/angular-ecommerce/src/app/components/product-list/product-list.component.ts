import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/model/cart-item';
import { Product } from 'src/app/model/product';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products?: Product[] = [];
  categoryId?: number;
  previousCategoryId?: number;
  searchMode = false;
  previousKeyword = "";

  //for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.fetchProductList();
  }

  fetchProductList(){
    this.searchMode = this.activatedRoute.snapshot.paramMap.get('keyword')? true: false;
    if (this.searchMode){
      let theKeyword = this.activatedRoute.snapshot.paramMap.get('keyword')!
      this.fetchSearchList(theKeyword);
    } else { 
      this.fetchFilteredList();
    }
  }

  fetchSearchList(theKeyword: string) {   
    
    if (this.previousKeyword !== theKeyword){
      this.pageNumber = 1;
    }
    this.previousKeyword = theKeyword;

    this.productService.searchProductsPaginated(
                                                  this.pageNumber-1, //-1 because value in backend is 0 based, value in frontend is 1 based
                                                  this.pageSize, 
                                                  theKeyword
                                                ).subscribe(this.processResponse())
  }

  fetchFilteredList(){
    this.activatedRoute.paramMap.subscribe ( res =>{
      this.categoryId =  Number(res.get('id')); //if no category is selected this will currently be 0

      //In case there is no catagory selected return cat 1
      if (this.categoryId === 0){
        this.categoryId = 1;
      }

      //reset page to one, if category changes in component
      if (this.categoryId !== this.previousCategoryId){
        this.pageNumber = 1;
      }
      this.previousCategoryId = this.categoryId;

      this.productService.fetchProductsPaginated(
                                                this.pageNumber-1, //-1 because value in backend is 0 based, value in frontend is 1 based
                                                this.pageSize, 
                                                this.categoryId
                                                ).subscribe(this.processResponse())
    })
  }

  updatePageSize(newPageSize: string){
    this.pageSize = Number(newPageSize);
    this.pageNumber = 1;
    this.fetchProductList();
  }

  processResponse(){
    return (data: any) =>
    {
    this.products = data._embedded.products;
    this.pageNumber = data.page.number + 1; //+1 because value in backend is 0 based, value in frontend is 1 based
    this.pageSize = data.page.size;
    this.totalElements = data.page.totalElements;
    }
  }

  addToCart(product: Product){
    this.cartService.addCartItem(new CartItem(product))
  }

}
