import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './services/theme/theme';
import { GoogleMapsModule } from '@angular/google-maps';

import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, GoogleMapsModule,],
    providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Forneça a chave da API
    {
      provide: 'GOOGLE_MAPS_API_KEY', 
      useValue: 'AIzaSyDvQ8YamcGrMBGAp0cslVWSRhS5NXNEDcI' // SUA CHAVE
    }
  ],
  
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService
  ) {
      
    }



  ngOnInit() {
    
    // Garante que o tema seja aplicado na inicialização
    setTimeout(() => {
      this.themeService.setTheme(this.themeService.getCurrentMode());
    }, 100);
  }
}