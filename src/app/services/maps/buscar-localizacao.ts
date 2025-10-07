import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class BuscarLocalizacao {
  private autocompleteService: any;

  constructor(private http: HttpClient) {
    // Inicializa o serviço Autocomplete assim que o serviço é criado.
    // Garante que o objeto google está disponível.
    this.initService();
  }

  private initService() {
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    } else {
      console.error('Google Maps Places library not loaded.');
      // Opcional: Adicione lógica para tentar novamente ou notificar o usuário.
    }
  }

  getAddresses(query: string): Observable<any> {
    if (!this.autocompleteService) {
      this.initService();
    }

    if (!this.autocompleteService || !query) {
      return from(Promise.resolve({ predictions: [] }));
    }

    const request = {
      input: query,
      language: 'pt-BR',
      // Você pode adicionar mais opções aqui, como types ou componentRestrictions
    };

    // O `getPlacePredictions` é assíncrono, então usamos um Observable para tratá-lo.
    return from(
      new Promise((resolve, reject) => {
        this.autocompleteService.getPlacePredictions(request, (predictions: any, status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve({ predictions });
          } else {
            reject(status);
          }
        });
      })
    ).pipe(
      map((result: any) => result)
    );
  }


getCoordsFromPlaceId(placeId: string): Observable<{ lat: number, lng: number }> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=AIzaSyDvQ8YamcGrMBGAp0cslVWSRhS5NXNEDcI`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.status === 'OK' && response.results.length > 0) {
          const location = response.results[0].geometry.location;
          return {
            lat: location.lat,
            lng: location.lng
          };
        }
        throw new Error('Coordenadas não encontradas para este Place ID.');
      })
    );
  }


}