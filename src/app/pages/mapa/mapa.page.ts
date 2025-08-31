import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle } from 'ionicons/icons';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';

const apiKey = "AIzaSyDvQ8YamcGrMBGAp0cslVWSRhS5NXNEDcI";

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapaPage implements AfterViewInit {
  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  newMap?: GoogleMap;
  userLocation?: { lat: number; lng: number };
  customStyle = [
                {
                    featureType: 'all',
                    elementType: 'geometry',
                    stylers: [{ color: '#f5f5f5' }]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#c5e3f6' }]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#ffffff' }]
                },
                {
                    featureType: 'road',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#7c7c7c' }]
                }
            ];

  constructor() {
    addIcons({ home, map, call, settings, personCircle });
  }

  async ngAfterViewInit() {
    await this.getCurrentLocation();
    await this.createMap();
  }

  // Método usando Capacitor Geolocation
  async getCurrentLocation(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.userLocation = {
        lat: -28.593127928435898,
        lng: -49.428683971705595
      };
      console.log('Localização do usuário:', this.userLocation);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      // Fallback
      this.userLocation = {
        lat: -23.5505,
        lng: -46.6333
      };
    }
  }

  async createMap() {

    if (!this.mapRef?.nativeElement) {
      console.error('Map container not found');
      return;
    }

    try {
      this.newMap = await GoogleMap.create({
        id: 'my-map',
        element: this.mapRef.nativeElement,
        apiKey: apiKey,
        config: {
          center: this.userLocation!,
          zoom: 14,
          disableDefaultUI: true,          // Remove TODOS os controles // 'greedy' para mais controle
          zoomControl: false,              // Remove controle de zoom
          mapTypeControl: false,           // Remove controle de tipo de mapa
          scaleControl: true,             // Remove escala
          streetViewControl: false,        // Remove o boneco do Street View
          rotateControl: false,            // Remove controle de rotação
          fullscreenControl: false,
          mapId: "16abc58f124f6eeb3b852ceb" 
        },

      });

      console.log('Mapa criado com sucesso!');
      await this.addUserMarker();



    } catch (error) {
      console.error('Error creating map:', error);
    }
  }

  async addUserMarker() {
    if (!this.newMap || !this.userLocation) return;

    await this.newMap.addMarker({
      coordinate: this.userLocation!,
      title: 'Sua localização',
      snippet: 'Você está aqui!'
    });
  }




}