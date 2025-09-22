import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GeocodificacaoService {
  private geocoderService: any;

  constructor() {
    this.initService();
  }

  private initService() {
    if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
      this.geocoderService = new google.maps.Geocoder();
    } else {
      console.error('Google Maps Geocoder library not loaded.');
      // Opcional: Adicionar lógica de fallback
    }
  }

  /**
   * Converte coordenadas de latitude e longitude em um endereço legível.
   * @param lat Latitude da localização.
   * @param lng Longitude da localização.
   * @returns Um Observable que emite o resultado da geocodificação reversa.
   */
  getAddressFromCoords(lat: number, lng: number): Observable<any> {
    if (!this.geocoderService) {
      this.initService();
    }

    if (!this.geocoderService) {
      return from(Promise.reject('Google Maps Geocoder not available.'));
    }

    const request = {
      location: { lat: lat, lng: lng },
      language: 'pt-BR',
    };

    return from(
      new Promise((resolve, reject) => {
        this.geocoderService.geocode(request, (results: any, status: any) => {
          if (status === google.maps.GeocoderStatus.OK) {
            resolve({ results });
          } else {
            reject(status);
          }
        });
      })
    ).pipe(
      map((result: any) => result)
    );
  }
}