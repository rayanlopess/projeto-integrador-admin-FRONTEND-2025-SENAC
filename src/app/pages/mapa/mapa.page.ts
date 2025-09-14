import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, AfterViewInit, ViewChild, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle, invertMode } from 'ionicons/icons';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';

import { SimplePopoverComponent } from '../../components/simple-popover/simple-popover.component';
import { AlertController, PopoverController} from '@ionic/angular/standalone';
import { ThemeService, ThemeMode } from '../../services//theme/theme';
import { Subscription } from 'rxjs';

const apiKey = "AIzaSyDvQ8YamcGrMBGAp0cslVWSRhS5NXNEDcI";

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

  // Signal para controlar o estado de carregamento
  isLoading = signal(true);
  loadError = signal(false);

  constructor(
    public alertController: AlertController,
    private popoverCtrl: PopoverController,
    private themeService: ThemeService
  ) {
    addIcons({ home, map, call, settings, personCircle, invertMode });
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
    try {
      this.isLoading.set(true);
      await this.getCurrentLocation();
      await this.createMap();
      this.isMapInitialized = true;
      this.isLoading.set(false);
    } catch (error) {
      console.error('Erro durante inicialização do mapa:', error);
      this.loadError.set(true);
      this.isLoading.set(false);
    }
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
      
    }
  }

  async createMap() {
    if (!this.mapRef?.nativeElement) {
      console.error('Map container not found');
      this.loadError.set(true);
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
          mapId: this.currentTheme === 'dark' ? "6fbe87b38800cc70488f7956" : "6fbe87b38800cc70bd62cb93",
        },
      });

      console.log('Mapa criado com sucesso! Tema:', this.currentTheme);
      await this.addUserMarker();

    } catch (error) {
      console.error('Error creating map:', error);
      throw error; // Propaga o erro para ser tratado no ngAfterViewInit
    }
  }

  async recreateMapWithNewTheme() {
    console.log('Recriando mapa com novo tema:', this.currentTheme);
    this.isLoading.set(true);
    try {
      await this.createMap();
      this.isLoading.set(false);
    } catch (error) {
      console.error('Erro ao recriar mapa:', error);
      this.isLoading.set(false);
    }
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

  // Método para tentar recarregar em caso de erro
  async retryLoadMap() {
    this.loadError.set(false);
    this.isLoading.set(true);
    try {
      await this.getCurrentLocation();
      await this.createMap();
      this.isMapInitialized = true;
      this.isLoading.set(false);
    } catch (error) {
      console.error('Erro ao recarregar mapa:', error);
      this.loadError.set(true);
      this.isLoading.set(false);
    }
  }
}