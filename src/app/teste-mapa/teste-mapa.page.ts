import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton} from '@ionic/angular/standalone';

import { Platform } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-teste-mapa',
  templateUrl: './teste-mapa.page.html',
  styleUrls: ['./teste-mapa.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonButton ,CommonModule, FormsModule]
})
export class TesteMapaPage implements OnInit {

  @ViewChild('mapElement') mapElement!: ElementRef;
  status: string = 'Iniciando...';

  constructor(private platform: Platform) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.checkGoogle();
      }, 1000);
    });
  }

  checkGoogle() {
    if (typeof google === 'undefined') {
      this.status = 'Google Maps NÃO carregado!';
      console.error('Google Maps script não carregado');
    } else {
      this.status = 'Google Maps carregado com sucesso!';
      console.log('Google Maps disponível:', google);
    }
  }

  initMap() {
    try {
      this.status = 'Tentando inicializar mapa...';
      
      if (!this.mapElement?.nativeElement) {
        this.status = 'Elemento do mapa não encontrado';
        return;
      }

      if (typeof google === 'undefined') {
        this.status = 'Google Maps não disponível';
        return;
      }

      const mapOptions = {
        center: { lat: -23.5505, lng: -46.6333 },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }]
          }
        ]
      };

      const map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      
      // Adicionar marcador para confirmar que funciona
      new google.maps.Marker({
        position: { lat: -23.5505, lng: -46.6333 },
        map: map,
        title: 'Teste Funcionando!'
      });

      this.status = 'Mapa inicializado com sucesso!';
      console.log('Mapa criado:', map);

    } catch (error: any) {
      this.status = 'Erro: ' + error.message;
      console.error('Erro ao criar mapa:', error);
    }
  }
}
