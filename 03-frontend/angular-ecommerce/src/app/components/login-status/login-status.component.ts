import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated?: boolean = false;
  userFullName: string = '';
  private storage = sessionStorage; //get access to browser's session storage

  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
    ) { }

  ngOnInit(): void {

    //subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated
        this.getUserDetails()
      }
    )
  }

  getUserDetails(){
    if (this.isAuthenticated){
      //fetch user claims

      //fetch users details 
      this.oktaAuth.getUser().then(res =>
        {
          this.userFullName = res.name as string;

          const userEmail = res.email as string;
          this.storage.setItem("userEmail", JSON.stringify(userEmail))

        }
      )
    }
  }

  logout(){
    //terminate okata-session and delete tokens
    this.oktaAuth.signOut();
    this.storage.removeItem('userEmail');
  }

}
