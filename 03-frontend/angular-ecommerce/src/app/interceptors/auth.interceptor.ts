import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { from, lastValueFrom, Observable } from 'rxjs';
import { OKTA_AUTH } from '@okta/okta-angular';
import { authenticate, OktaAuth } from '@okta/okta-auth-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaauth: OktaAuth) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(modifiedRequest: HttpRequest<unknown>, next: HttpHandler): Promise<HttpEvent<any>> {
  
    //add access token only for secured entpoints
    const endPoint = `${environment.luv2ShopApiUrl}/orders`;
    const securedEndpoints = [endPoint];

    //check if request contains recured url
    if (securedEndpoints.some(url => modifiedRequest.urlWithParams.includes(url))){

      //getAccessToken
      const accessToken = this.oktaauth.getAccessToken();

      //clone request and asign clone with added acess-token-header --> clone because req is immutable
      modifiedRequest = modifiedRequest.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      })

    }

    return await lastValueFrom(next.handle(modifiedRequest));

  }

}
