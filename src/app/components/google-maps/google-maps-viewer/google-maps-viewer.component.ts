import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { IonContent } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { ThemeService, ThemeMode } from '../../../services/theme/theme';

export interface LatLng {
    lat: number;
    lng: number;
}

@Component({
    selector: 'app-google-maps-viewer',
    templateUrl: './google-maps-viewer.component.html',
    styleUrls: ['./google-maps-viewer.component.scss'],
    standalone: true,
    imports: [CommonModule, GoogleMapsModule, IonContent]
})
export class GoogleMapsViewerComponent implements OnInit, OnChanges {

    // Novo Input: Nome/Endereço para pesquisa no Maps
    @Input() addressSearchString: string = '';

    // Antigos Inputs (agora opcionais, usados como fallback/ponto inicial)
    @Input() initialLatitude?: number;
    @Input() initialLongitude?: number;

    @Input() isSelectable: boolean = false;
    @Output() coordsChange = new EventEmitter<LatLng>();
    // Propriedades do Google Maps
    center: google.maps.LatLngLiteral = { lat: 0, lng: 0 }; // Ponto inicial no (0,0)
    zoom = 15;
    markerOptions!: google.maps.MarkerOptions;
    markerPosition!: google.maps.LatLngLiteral;
    mapOptions!: google.maps.MapOptions;

    private themeSubscription?: Subscription;
    currentTheme: 'light' | 'dark' = 'light';


    private geocoder!: google.maps.Geocoder;

    constructor(private themeService: ThemeService,) { }


    ngOnInit() {
        // Inicializa o Geocoder quando o componente é criado
        // Verifica se o Google Maps já carregou
        if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
            this.geocoder = new google.maps.Geocoder();
        }
        this.updateMapConfig();


        this.currentTheme = this.themeService.getCurrentTheme();


        this.themeSubscription = this.themeService.themeChanged$.subscribe((mode: ThemeMode) => {
            const newTheme = this.themeService.getCurrentTheme();
            if (newTheme !== this.currentTheme) {
                this.currentTheme = newTheme;
                this.recreateMapWithNewTheme();
            } else {
                this.currentTheme = newTheme;
            }
            if (this.themeSubscription) {
                this.themeSubscription.unsubscribe();
            }
        });



    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['addressSearchString'] || changes['initialLatitude'] || changes['initialLongitude']) {
            this.updateMapConfig();
        }
    }
    async ionViewWillLeave() {
        await this.destroyMap();
    }

    private updateMapConfig() {
        // 1. Prioridade: Se houver uma string de endereço, usamos o Geocoding
        if (this.addressSearchString && !this.isSelectable) {
            this.geocodeAddress(this.addressSearchString);
        }
        // 2. Fallback (ou modo de seleção): Usamos as coordenadas fornecidas
        else if (this.initialLatitude !== undefined && this.initialLongitude !== undefined) {
            // Garante a conversão para Number, importante para evitar o erro "not a number"
            this.setMapPosition(Number(this.initialLatitude), Number(this.initialLongitude), 15);
        }

        this.markerOptions = {
            draggable: this.isSelectable, // Marcador arrastável se estiver no modo de seleção
        };

        this.mapOptions = {

            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,

            zoomControl: this.isSelectable,





            disableDefaultUI: true,


            scaleControl: false,

            rotateControl: false,

           
        };
    }

    /**
     * Converte a string de endereço em coordenadas geográficas.
     */
    private geocodeAddress(address: string): void {
        if (!this.geocoder) {
            console.warn('Google Maps Geocoder não inicializado. Usando coordenadas iniciais.');
            // Fallback se o Geocoder não estiver pronto
            return this.setMapPosition(Number(this.initialLatitude) || 0, Number(this.initialLongitude) || 0, 15);
        }

        this.geocoder.geocode({ 'address': address }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();
                // Configura o mapa com a coordenada precisa e zoom maior
                this.setMapPosition(lat, lng, 17);
            } else {
                console.error(`Geocoding falhou para "${address}". Status: ${status}. Usando coordenadas salvas.`);
                // Fallback para coordenadas salvas (lati, longi)
                this.setMapPosition(Number(this.initialLatitude) || 0, Number(this.initialLongitude) || 0, 15);
            }
        });
    }

    /**
     * Define a posição central e do marcador no mapa.
     */
    private setMapPosition(lat: number, lng: number, zoomLevel: number): void {
        // Garante que são números válidos, caso contrário usa (0,0)
        const finalLat = isFinite(lat) ? lat : 0;
        const finalLng = isFinite(lng) ? lng : 0;

        this.center = { lat: finalLat, lng: finalLng };
        this.markerPosition = { lat: finalLat, lng: finalLng };
        this.zoom = zoomLevel;
    }

    /**
     * Captura o evento quando o marcador é arrastado (somente no modo isSelectable=true).
     */
    markerDragEnd(event: google.maps.MapMouseEvent) {
        if (event.latLng) {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();

            this.markerPosition = { lat: newLat, lng: newLng };
            this.coordsChange.emit({ lat: newLat, lng: newLng });
        }
    }

    async recreateMapWithNewTheme() {
    console.log('Recriando mapa com novo tema:', this.currentTheme);
 
    try {
      await this.updateMapConfig();
      
      
      
    } catch (error) {
      console.error('Erro ao recriar mapa:', error);
      
    }
  }

  async destroyMap() {
  
  }
}