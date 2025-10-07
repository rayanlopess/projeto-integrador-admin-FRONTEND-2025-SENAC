import { Component, OnInit, NgZone } from '@angular/core'; // Adicionar NgZone
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './services/theme/theme';
import { GoogleMapsModule } from '@angular/google-maps';

import { RouteReuseStrategy, Router } from '@angular/router'; // Importar Router
import { IonicRouteStrategy } from '@ionic/angular';
import { App, URLOpenListenerEvent } from '@capacitor/app'; // Importar Capacitor App

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  // Certifique-se de que os imports necessários do Ionic estão aqui
  imports: [IonApp, IonRouterOutlet, GoogleMapsModule], 
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Forneça a chave da API
    {
      provide: 'GOOGLE_MAPS_API_KEY', 
      useValue: 'AIzaSyDvQ8YamcGrMBGAp0cslVWSRhS5NXNEDcI' // SUA CHAVE
    }
  ],
  // O componente é standalone, então ele precisa importar tudo que usa
})
export class AppComponent implements OnInit {
  
  // 1. INJEÇÃO: Adicionar Router e NgZone no construtor
  constructor(
    private themeService: ThemeService,
    private router: Router, 
    private zone: NgZone // ESSENCIAL para o Deep Linking
  ) {
    // Inicializa o listener de Deep Link imediatamente
    this.initializeAppListeners();
  }

  ngOnInit() {
    // Garante que o tema seja aplicado na inicialização
    setTimeout(() => {
      this.themeService.setTheme(this.themeService.getCurrentMode());
    }, 100);
  }

  // 2. Método para configurar o listener de Deep Link
  initializeAppListeners() {
    
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      
      // O NgZone é crucial para garantir que a navegação do Angular ocorra
      this.zone.run(() => {
        
        const urlCompleta = event.url;
        // Exemplo da URL: 'filamedadmin://alteracao-senha/ABC123XYZ'
        
        // Remove o prefixo customizado: 'filamedadmin://'
        // IMPORTANTE: Use o esquema que você configurou no AndroidManifest.xml
        const pathComParametro = urlCompleta.split('://').pop(); 
        
        if (pathComParametro) {
          
          // O Angular Router irá casar 'alteracao-senha/ABC123XYZ' com a rota 'alteracao-senha/:recupCode'
          this.router.navigateByUrl(pathComParametro, { replaceUrl: true });
          
          console.log('Deep Link Navegado para:', pathComParametro);
          
        } else {
          console.log('Deep Link capturado, mas sem rota válida.');
        }
      });
    });
  }
}