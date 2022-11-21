package com.luv2code.ecommerce.controller;

import com.luv2code.ecommerce.dto.PaymentInfo;
import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;
import com.luv2code.ecommerce.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    CheckoutService checkoutService;

    @Autowired //strictly speaking constructor injection only needs Autowired, if there is more than one constructor
    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){

        PurchaseResponse response = this.checkoutService.placeOrder(purchase);
        return response;

    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentintent(@RequestBody PaymentInfo paymentInfo) throws StripeException {
       PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);

       ResponseEntity<String> response = new ResponseEntity<>(paymentIntent.toJson(), HttpStatus.OK);

       return response;
    }

}
