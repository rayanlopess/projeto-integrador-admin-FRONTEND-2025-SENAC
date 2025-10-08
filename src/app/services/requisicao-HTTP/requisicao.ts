import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; };

  responseType?: 'json'; // ou 'text', 'blob', 'arraybuffer'
  // Adicione outras opções se precisar
}

@Injectable({
  providedIn: 'root'
})
export class RequiemDosDeusesService {

  private baseUrl = 'http://10.241.238.192:2324';

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

  get(endpoint: string, options?: HttpOptions): Observable<any> {
    // The compiler will now match this to the simplest GET overload, 
    // expecting a JSON body, which works for your validation endpoint.
    return this.http.get(`${this.baseUrl}${endpoint}`, options);
  }

  post(endpoint: string, formData: any, options?: HttpOptions): Observable<any> {

    // Mescla os cabeçalhos JSON padrão com as opções customizadas (que incluirão o 'Authorization')
    const finalOptions = { ...this.getJsonHttpOptions(), ...options };

    // O HttpClient envia o token de Authorization contido em finalOptions
    return this.http.post(`${this.baseUrl}${endpoint}`, formData, finalOptions);
  }

  // PUT e DELETE removidos ou não incluídos, pois não são usados no UserService atual.
}