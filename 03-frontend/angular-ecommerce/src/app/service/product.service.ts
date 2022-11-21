import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { __exportStar } from 'tslib';
import { Product } from '../model/product';
import { map } from 'rxjs/operators'
import { ProductCategory } from '../model/product-category';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  baseUrl = environment.luv2ShopApiUrl
  productUrl = this.baseUrl + "/products/"
  productsUrl = this.baseUrl + "/products/search/findByCategoryId?id=" //by default this returns 20 items
  categoriesUrl = this.baseUrl + "/product-category"
  searchUrl = this.baseUrl +  "/products/search/findByNameContaining?name="

  constructor(private http: HttpClient) { }

  fetchProducts(categoryId: number): Observable<Product[]> {
    return this.http.get<IGetProductsWrapper>(this.productsUrl + categoryId)
      .pipe(
        map(res => res._embedded.products)
      )
  }

  fetchProductsPaginated(thePage: number, theSize: number, categoryId: number): Observable<IGetProductsWrapper> {
    console.log(`getting produicts from: ${this.productsUrl}${categoryId}&page=${thePage}&size=${theSize}`)
    return this.http.get<IGetProductsWrapper>(`${this.productsUrl}${categoryId}&page=${thePage}&size=${theSize}`)
  }

  fetchProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(this.productUrl + productId);
  }

  fetchProductCategories(): Observable<ProductCategory[] >{
    return this.http.get<IGetCategoriesWrapper>(this.categoriesUrl)
      .pipe(
        map (res => res._embedded.productCategory)
      )
  }

  searchProducts(theKeyword: string) {
    return this.http.get<IGetProductsWrapper>(this.searchUrl + theKeyword)
      .pipe(
        map(res => res._embedded.products)
      )
  }

  searchProductsPaginated(thePage: number, theSize: number, theKeyword: string){
    return this.http.get<IGetProductsWrapper>(`${this.searchUrl}${theKeyword}&page=${thePage}&size=${theSize}`)
  }
}

interface IGetProductsWrapper{
  _embedded: {
    products: Product[]
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface IGetCategoriesWrapper{
  _embedded: {
    productCategory: ProductCategory[]
  }
}
