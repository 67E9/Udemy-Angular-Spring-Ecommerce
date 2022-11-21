import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../model/country';
import { State } from '../model/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {
  baseUrl: string = environment.luv2ShopApiUrl;

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]>{
    return this.http.get<IGetResponseCountries>(`${this.baseUrl}/countries`)
      .pipe(map(c => c._embedded.countries));
  }

  getStates(countryCode: string): Observable<State[]>{
    return this.http
      .get<IGetResponseStates>(`${this.baseUrl}/states/search/findByCountryCode?code=${countryCode}`)
      .pipe(map(s => s._embedded.states));
  }

  getCreditCardMonths(startingMonth: number): Observable<number[]>{

    let months = this.range(startingMonth,12,1)
    
    return of(months);
  }

  getCreditCardYears(): Observable<number[]>{

    let today = new Date();

    let currentYear = today.getFullYear();

    let relevantYears = this.range(currentYear, currentYear+10, 1);

    return of(relevantYears);
  }

  range(start: number, stop: number, step:number ): number[]{
    return Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
  }
}

interface IGetResponseCountries{
  _embedded: { 
    countries: Country[]
    }
}

interface IGetResponseStates{
  _embedded: {
    states: State[]
  }
}