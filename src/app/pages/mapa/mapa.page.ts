import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, AfterViewInit, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle } from 'ionicons/icons';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';

import { SimplePopoverComponent } from '../../components/simple-popover/simple-popover.component';
import { AlertController, PopoverController} from '@ionic/angular/standalone';
import { ThemeService, ThemeMode } from '../../services//theme/theme';
import { Subscription } from 'rxjs';

const apiKey = "AIzaSyDvQ8YamcGrMBGAp0cslVWSRhS5NXNEDcI";

// Estilos para o modo claro
const lightStyle = [
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
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#747474' }]
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }]
  }
];

// Estilos para o modo escuro
const darkStyle = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#1f2a38' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }]
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#cdccd6' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#2c3748' }]
  }
];

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapaPage implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  newMap?: GoogleMap;
  userLocation?: { lat: number; lng: number };
  private themeSubscription?: Subscription;
  currentTheme: 'light' | 'dark' = 'light';
  private isMapInitialized = false;

  constructor(
    public alertController: AlertController,
    private popoverCtrl: PopoverController,
    private themeService: ThemeService
  ) {
    addIcons({ home, map, call, settings, personCircle });
  }

  ngOnInit() {
    // Obter o tema atual
    this.currentTheme = this.themeService.getCurrentTheme();
    
    // Inscrever-se nas mudanças de tema
    this.themeSubscription = this.themeService.themeChanged$.subscribe((mode: ThemeMode) => {
      const newTheme = this.themeService.getCurrentTheme();
      
      // Só recriar o mapa se o tema realmente mudou e o mapa já foi inicializado
      if (newTheme !== this.currentTheme && this.isMapInitialized) {
        this.currentTheme = newTheme;
        this.recreateMapWithNewTheme();
      } else {
        this.currentTheme = newTheme;
      }
    });
  }

  ngOnDestroy() {
    // Cancelar a inscrição para evitar vazamentos de memória
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    
    // Limpar o mapa
    this.destroyMap();
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: SimplePopoverComponent,
      event
    });
    await popover.present();
  }

  async ngAfterViewInit() {
    await this.getCurrentLocation();
    await this.createMap();
    this.isMapInitialized = true;
  }

  // Método usando Capacitor Geolocation
  async getCurrentLocation(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log('Localização do usuário:', this.userLocation);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      // Fallback para coordenadas padrão
      this.userLocation = {
        lat: -28.593127928435898,
        lng: -49.428683971705595
      };
    }
  }

  async createMap() {
    if (!this.mapRef?.nativeElement) {
      console.error('Map container not found');
      return;
    }

    try {
      // Destruir mapa existente se houver
      await this.destroyMap();

      this.newMap = await GoogleMap.create({
        id: 'my-map',
        element: this.mapRef.nativeElement,
        apiKey: apiKey,
        config: {
          center: this.userLocation!,
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          mapId: "16abc58f124f6eeb3b852ceb",
          styles: this.currentTheme === 'dark' ? darkStyle : lightStyle
        },
      });

      console.log('Mapa criado com sucesso! Tema:', this.currentTheme);
      await this.addUserMarker();

    } catch (error) {
      console.error('Error creating map:', error);
    }
  }

  async recreateMapWithNewTheme() {
    console.log('Recriando mapa com novo tema:', this.currentTheme);
    await this.createMap();
  }

  async destroyMap() {
    if (this.newMap) {
      try {
        await this.newMap.destroy();
        this.newMap = undefined;
      } catch (error) {
        console.error('Error destroying map:', error);
      }
    }
  }

  async addUserMarker() {
    if (!this.newMap || !this.userLocation) return;

    try {
      await this.newMap.addMarker({
        coordinate: this.userLocation!,
        title: 'Sua localização',
        snippet: 'Você está aqui!'
        // iconUrl: 'assets/icon/user-marker.png' // Opcional: ícone personalizado
      });
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  }
}