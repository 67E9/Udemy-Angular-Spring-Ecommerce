package com.luv2code.ecommerce.service.implementation;


import com.luv2code.ecommerce.dao.CustomerRepository;
import com.luv2code.ecommerce.dto.PaymentInfo;
import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;
import com.luv2code.ecommerce.entity.Customer;
import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.entity.OrderItem;
import com.luv2code.ecommerce.service.CheckoutService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               @Value("${stripe.key.secret}") String stripeSecretKey) {
        this.customerRepository = customerRepository;
        Stripe.apiKey=stripeSecretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrieve the order info from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String trackingNumber = this.generateOrderTrackingNumber();
        order.setOrderTrackingNumber(trackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::add);

        //populate order with billing and shipping Addresses
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();

        //check if customer already exists based on email, if yes, use existing customer
        Customer customerFromDB = customerRepository.findByEmail(customer.getEmail());

        if (customerFromDB != null){
            customer = customerFromDB;
        }

        customer.add(order);

        //save to DB
        customerRepository.save(customer);

        //return response;
        return new PurchaseResponse(order.getOrderTrackingNumber());

    }

    private String generateOrderTrackingNumber(){
        return UUID.randomUUID().toString();
        //TODO: this method does not check for UUID collisions
        //collisions are very unlikely, but we might want to check for them anyway
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodsTypes = new ArrayList<>();
        paymentMethodsTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodsTypes);
        params.put("description", "Luv2Shop purchase");
        params.put("receipt_email", paymentInfo.getReceiptEmail());

        return PaymentIntent.create(params);

    }
}
