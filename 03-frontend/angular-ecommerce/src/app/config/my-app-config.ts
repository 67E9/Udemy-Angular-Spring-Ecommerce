export default {

    //configuration for oauth2 w/ Okta
    oidc: {
        clientId: '', //add okta client-id here
        issuer: '/oauth2/default', //add okta issuer url at the beginning of this path (application url!) 
        redirectUri: 'https://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
    }

}
