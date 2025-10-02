import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequiemDosDeusesService {

  private baseUrl = 'http://localhost:3000';

  constructor(public http: HttpClient) { }

  // Opções de cabeçalho padrão para JSON
  private getJsonHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }

  get(endpoint: string, dados: any) {
    return this.http.get(`${this.baseUrl}${endpoint}`, {
      params: dados
    });
  }

  post(endpoint: string, formData: any) {
    return this.http.post(`${this.baseUrl}${endpoint}`, formData, this.getJsonHttpOptions());
  }

  // PUT e DELETE removidos ou não incluídos, pois não são usados no UserService atual.
}