import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FalconeResponse } from '../models/FalconeResponse';
import { Planet } from '../models/Planet';
import { ResponseToken } from '../models/ResponseToken';
import { Vehicle } from '../models/Vehicle';

@Injectable({
  providedIn: 'root',
})
export class SpaceServiceService {
  getPlanetsUrl = 'https://findfalcone.herokuapp.com/planets';
  getVehiclesUrl = 'https://findfalcone.herokuapp.com/vehicles';
  getPostTokenUrl = 'https://findfalcone.herokuapp.com/token';
  getFalconeResponseUrl = 'https://findfalcone.herokuapp.com/find';

  constructor(private httpCli: HttpClient) {}

  // An ajax call to obtain the planets
  getPlanets() {
    return this.httpCli.get<Array<Planet>>(this.getPlanetsUrl);
  }

  // An ajax call to get the vehicles
  getVehicles() {
    return this.httpCli.get<Array<Vehicle>>(this.getVehiclesUrl);
  }

  // An ajax call done to obtain the authorization token
  getPostToken() {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };
    return this.httpCli.post<ResponseToken>(
      this.getPostTokenUrl,
      '',
      httpOptions
    );
  }

  // An ajax call done to submit the Falcone Request
  postFalconeSubmission(requestBody: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.httpCli.post<FalconeResponse>(
      this.getFalconeResponseUrl,
      requestBody,
      httpOptions
    );
  }
}
