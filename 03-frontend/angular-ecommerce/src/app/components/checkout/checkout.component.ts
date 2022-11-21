import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/model/country';
import { Order } from 'src/app/model/order';
import { OrderItem } from 'src/app/model/order-item';
import { PaymentInfo } from 'src/app/model/payment-info';
import { Purchase } from 'src/app/model/purchase';
import { State } from 'src/app/model/state';
import { CartService } from 'src/app/service/cart.service';
import { CheckoutService } from 'src/app/service/checkout.service';
import { ShopFormService } from 'src/app/service/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup = new FormGroup({});
  totalQuantity: number = 0;
  totalPrice: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] =[];
  shippingStates: State[] =[];
  billingStates: State[] =[];
  storage: Storage = sessionStorage;
  userEmail = '';
  isDisabled = false;
  //for stripe api:
  stripe = Stripe(environment.stripePublishableKey, {
    locale: 'en'
  });
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";



  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    ){}

  ngOnInit(): void {

    this.setupStripePaymentForm();

    if (this.storage.getItem('userEmail')){
      this.userEmail = JSON.parse(this.storage.getItem('userEmail')!)
    }

    this.cartService.totalPrice$.subscribe(
      p => this.totalPrice = p
    )

    this.cartService.totalQuantity$.subscribe(
      q => this.totalQuantity = q
    )

    this.shopFormService.getCountries().subscribe(
      c => this.countries = c
    )

    //only for form w/o stripe:
    // this.shopFormService.getCreditCardMonths(1).subscribe(
    //   m => this.creditCardMonths = m
    // )

    // this.shopFormService.getCreditCardYears().subscribe(
    //   y => this.creditCardYears = y
    // )

    this.checkoutForm = this.formBuilder.group({      
      customer: this.formBuilder.group(
          {
            firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
            lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
            email: new FormControl(this.userEmail, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
          }
        ),
      shippingAddress: this.formBuilder.group(
          {
            country: new FormControl ('', [Validators.required]),
            street: new FormControl ('', [Validators. required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
            city : new FormControl ('', [Validators. required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
            state: new FormControl ('', [Validators.required]),
            zipCode: new FormControl ('', [Validators. required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
          }
        ),
      billingAddress: this.formBuilder.group(
          {
            country: new FormControl ('', [Validators.required]),
            street: new FormControl ('', [Validators. required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
            city : new FormControl ('', [Validators. required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
            state: new FormControl ('', [Validators.required]),
            zipCode: new FormControl ('', [Validators. required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
          }
        ),
      creditCardInfo: this.formBuilder.group(
          {
            //validation for form w/o stripe:
            /*cardType: new FormControl ('', [Validators.required]),
            nameOnCard: new FormControl ('', [Validators. required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
            cardNumber: new FormControl ('', [Validators.required, Validators.pattern('[0-9]{16}')]),
            securityCode: new FormControl ('', [Validators.required, Validators.pattern('[0-9]{3}')]),
            expirationYear: new FormControl ('', [Validators.required]),
            expirationMonth: new FormControl ('', [Validators.required])*/
          }
        )   
      }
    )    

  }
  setupStripePaymentForm() {
    //get stripe elements
    var elements = this.stripe.elements();

    //create a card element
    this.cardElement = elements.create('card', {hidePostalCode: true});

    //add an instance of card UI component into the "#card-element" div
    this.cardElement.mount("#card-element");

    //add event binding for the change event in the card element
    this.cardElement.on('change', (event: any) => {
      //get card element errors
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
        //show validation error to customer
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    })

  }

  //getters used in html-templatete for form validation
  get firstName(){ return this.checkoutForm.get('customer.firstName');}
  get lastName(){ return this.checkoutForm.get('customer.lastName');}
  get email(){ return this.checkoutForm.get('customer.email');}

  get shippingAddressCountry(){ return this.checkoutForm.get('shippingAddress.country')}
  get shippingAddressStreet(){ return this.checkoutForm.get('shippingAddress.street')}
  get shippingAddressCity(){ return this.checkoutForm.get('shippingAddress.city')}
  get shippingAddressState(){ return this.checkoutForm.get('shippingAddress.state')}
  get shippingAddressZipCode(){ return this.checkoutForm.get('shippingAddress.zipCode')} 

  get billingAddressCountry(){ return this.checkoutForm.get('billingAddress.country')}
  get billingAddressStreet(){ return this.checkoutForm.get('billingAddress.street')}
  get billingAddressCity(){ return this.checkoutForm.get('billingAddress.city')}
  get billingAddressState(){ return this.checkoutForm.get('billingAddress.state')}
  get billingAddressZipCode(){ return this.checkoutForm.get('billingAddress.zipCode')}

  get cardType(){ return this.checkoutForm.get('creditCardInfo.cardType')}
  get nameOnCard(){ return this.checkoutForm.get('creditCardInfo.nameOnCard')}
  get cardNumber(){ return this.checkoutForm.get('creditCardInfo.cardNumber')}
  get securityCode(){ return this.checkoutForm.get('creditCardInfo.securityCode')}
  get expirationYear(){ return this.checkoutForm.get('creditCardInfo.expirationYear')}
  get expirationMonth(){ return this.checkoutForm.get('creditCardInfo.expirationMonth')}

  handleSubmit(){

    this.isDisabled = true;

    if (this.checkoutForm.invalid){
      this.checkoutForm.markAllAsTouched();
    }

    //set up order
    let order = new Order(this.totalPrice, this.totalQuantity);
    
    //get cart items
    let cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    let orderItems: OrderItem[] = [];
    orderItems=cartItems.map(item => new OrderItem(item));

    //populate purchase - customer
    let purchase = new Purchase();
    purchase.customer = this.checkoutForm.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutForm.controls['shippingAddress'].value;
    purchase.shippingAddress!.country = (JSON.parse(JSON.stringify(purchase.shippingAddress?.country))).name;
    purchase.shippingAddress!.state = (JSON.parse(JSON.stringify(purchase.shippingAddress?.state))).name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutForm.controls['billingAddress'].value;
    purchase.billingAddress!.country = (JSON.parse(JSON.stringify(purchase.billingAddress?.country))).name;
    purchase.billingAddress!.state = (JSON.parse(JSON.stringify(purchase.billingAddress?.state))).name;

    //populate purchase - order and items
    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100); //convert amount to cents, Math.round is to prevent Java Integer from truncating .99999 in the backend
    this.paymentInfo.currency = "USD";

    this.paymentInfo.receiptEmail = purchase.customer?.email;

    //call Rest API
    
    // if valid form then:
    // - create payment intent
    // - confirm card payment
    // - place order

    if(this.checkoutForm.valid && this.displayError.textContent === ""){
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(paymentIntentResponse => {
        this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
          {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                email: purchase.customer?.email,
                name: `${purchase.customer?.firstName} ${purchase.customer?.lastName}`,
                address: {
                  line1: purchase.billingAddress?.street,
                  city: purchase.billingAddress?.city,
                  state: purchase.billingAddress?.state,
                  postal_code: purchase.billingAddress?.ZipCode,
                  country: this.billingAddressCountry?.value.code,
                }
              }
            }
          }, { handleActions: false})
        .then((result: any) => {
            if (result.error){
              this.isDisabled = false;
              //inform the customer there was an error at stripe:
              alert(`There was an error: ${result.error.message}`)
            } else {
              //call REST AOI via the CheckoutService
              this.checkoutService.placeOrder(purchase).subscribe( res =>{
                  console.log(res) //note: basic error handling prepared in service
                  alert("purchase successful");
                  //reset everything
                  this.cartService.cartItems = []
                  this.cartService.totalPrice$.next(0);
                  this.cartService.totalQuantity$.next(0);
                  this.cartService.persistCartItems(); //save now empty cart to storage to prevent reload issues
                  this.checkoutForm.reset;
                  this.isDisabled = false;
                  this.router.navigateByUrl('/');
                }
              )
            }
          })
        }
      )
    } else {
      this.checkoutForm.markAllAsTouched();
      this.isDisabled = false;
      return;
    }
    
    //old code withour stripe:
    // this.checkoutService.placeOrder(purchase).subscribe(
    //   res => 
    //   {console.log(res) //note: basic error handling prepared in service
    //   alert("purchase successful");
    //   //reset everything
    //   this.cartService.cartItems = []
    //   this.cartService.totalPrice$.next(0);
    //   this.cartService.totalQuantity$.next(0);
    //   this.checkoutForm.reset;
    //   this.router.navigateByUrl('/')
    //   }
    // )

    }

  toggleBillingEqualsShippingAdress(event: Event){

    if ((event.target as HTMLInputElement).checked){
      this.checkoutForm.controls['billingAddress'].setValue(
        this.checkoutForm.controls['shippingAddress'].value
      )
      //populate the states list for billing address with sates from shipping address
      this.billingStates = this.shippingStates;
    } else {
      this.checkoutForm.controls['billingAddress'].reset();
      //reset billing address states
      this.billingStates = [];
    }

  }

  //only for form w/o stripe:
  // handleMonthsAndYears(){
  //   const today = new Date();
  //   const selectedYear: number = Number(this.checkoutForm.get('creditCardInfo')?.value.expirationYear)

  //   if( Number(selectedYear) === today.getFullYear()){
  //     this.shopFormService.getCreditCardMonths(today.getMonth() + 1).subscribe(
  //       m => this.creditCardMonths = m
  //     )
  //   } else {
  //     this.shopFormService.getCreditCardMonths(1).subscribe(
  //       m => this.creditCardMonths = m
  //     )
  //   }
  //}

  getStates(formGroupName: string){
    let formGroup = this.checkoutForm.get(formGroupName)
    let code = formGroup?.value.country.code

    this.shopFormService.getStates(code).subscribe(
      s => {
        if (formGroupName == 'shippingAddress'){
          this.shippingStates = s;
        } 
        if ((formGroupName == 'billingAddress')){
          this.billingStates = s;
        }
        formGroup!.get('state')!.setValue(s[0])
      }
    )
  }

}
