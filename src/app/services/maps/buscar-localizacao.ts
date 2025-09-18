import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class BuscarLocalizacao {
  private autocompleteService: any;

  constructor() {
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
}