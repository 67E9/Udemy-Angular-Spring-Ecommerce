Author: Pascal Meßmer
Date: 21.11.2022

How to set this project up with HTTPS, Okta and Stripe?

Okta:
1. Set Up an Okta Application with following properties:
    sign-in redirect URI: https://localhost:4200/login/callback
    Sign-out redirect URIs: https://localhost:4200
    Under Security/API/Trusted Origins/CORS add: https://localhost:4200
2. Set up application properties in backend:
    okta.oauth2.client-id=
    okta.oauth2.issuer=   //ends in .../oauth2/default
3. Setup the login in Angular: m<-app-config.ts>, clientId and isuer must be same as above
    oidc: {
        clientId: '',   //<= here
        issuer: '',     //<= here
        redirectUri: 'https://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
    }

Stripe:
1. Backend: Set secret key in application.properties
    stripe.key.secret= 'sk_test_ ...'
2. Frontend: in environment.ts set stipe publishable key
      stripePublishableKey: 'pk_test_ ...'


HTTPS: Self-signed TLS-key renewal:
1. When you try to make this program run again the self-signed keys may have expired. Here is how to set them up:
2. Zertifikat für Frontend
    a. install open ssl
    b. location to put cert- and key-files: \angular-ecommerce\ssl-localhost
    c. follow the instruction on setup-open-ssl-key.pdf inside this repo
3. Zertifikat für Backend
    a. use java-keytool:
        keytool -genkeypair -noprompt \
        -alias luv2code \
        -keypass secret \
        -keystore src/main/resources/luv2code-keystore.p12 \
        -storeType PKCS12 -storepass secret \
        -keyalg RSA -keysize 2048 -validity 365 \
        -dname "C=US, ST=Pennsylvania, L=Philadelphia, O=luv2code, OU=Training Backend, CN=localhost" \
        -ext "SAN=dns:localhost"
    b. setup in application properties:
        #####
        #
        # HTTPS configuration
        #
        #####

        # Server web port
        server.port=8443

        # Enable HTTPS support (only accept HTTPS requests)
        server.ssl.enabled=true

        # Alias that identifies the key in the key store
        server.ssl.key-alias=luv2code

        # Keystore location
        server.ssl.key-store=classpath:luv2code-keystore.p12 //make sure to save keystore directly udner resources!

        # Keystore password
        server.ssl.key-store-password=secret

        # Keystore format
        server.ssl.key-store-type=PKCS12

        #comment in to change port to 9898
        #spring.profiles.active=qa