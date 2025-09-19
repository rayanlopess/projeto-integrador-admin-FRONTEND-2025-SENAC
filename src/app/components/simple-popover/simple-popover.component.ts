import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ThemeActionService } from '../../services/theme/theme-action';
import { ThemeService, ThemeMode } from '../../services/theme/theme';

import { addIcons } from 'ionicons';
import { sunny, moon, phonePortrait, close, arrowBackOutline} from 'ionicons/icons';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular/standalone';



@Component({
  selector: 'app-simple-popover',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-list>
      
      <ion-item lines="none" button (click)="irConfig()">
        <ion-label>Localização</ion-label>
        <ion-note slot="end">Raio: {{raioDistancia()}}km</ion-note>
      </ion-item>

      <ion-item lines="none" button (click)="openThemeSelector()">
        <ion-label>Tema</ion-label>
        <ion-note slot="end">{{ getCurrentStatus() }}</ion-note>
      </ion-item>
     
      <ion-item lines="none" button (click)="setOpenModalTerm(true)">
        <ion-label >Termos de Uso</ion-label>
      </ion-item>

      <ion-item lines="none" button (click)="setOpenModalPriv(true)">
        <ion-label>Privacidade e Segurança</ion-label>
      </ion-item>

      <ion-item lines="none" button (click)="abrirWhatsApp()">
        <ion-label>Central de Ajuda</ion-label>
      </ion-item>
    </ion-list>





  <ion-modal [isOpen]="isModalOpen">
    <ng-template>

      <ion-header>
      <ion-toolbar>

        <ion-buttons slot="start">
          <ion-button id="botao-toolbar" (click)="setOpenModalTerm(false)">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <div class="titulos-container">
          <ion-title id="home-title">Termos de Uso</ion-title>

        </div>

      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      
    </ion-content>

    </ng-template>
  </ion-modal>



  <ion-modal [isOpen]="isModalOpen1">
    <ng-template>

      <ion-header>
      <ion-toolbar>

        <ion-buttons slot="start">
          <ion-button id="botao-toolbar" (click)="setOpenModalPriv(false)">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <div class="titulos-container">
          <ion-title id="home-title">Privacidade e Segurança</ion-title>
        
        </div>

      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      
    </ion-content>

    </ng-template>
  </ion-modal>



  `,
  styles: [`
    ion-list {
      padding: 0;
      margin: 0;
    }
    ion-item {
      --min-height: 48px;
    }
  `]
})
export class SimplePopoverComponent {
  themeInfo: any;
  private subscription!: Subscription;
  public config: any = localStorage.getItem('configuracoesUsuario');

  isModalOpen = false;
  isModalOpen1 = false;

  constructor(
    private themeActionService: ThemeActionService,
    private themeService: ThemeService,
    private router: Router, 
    private popoverCtrl: PopoverController // Adicione esta linha
  ) {
    addIcons({ sunny, moon, phonePortrait, close, arrowBackOutline});
  }

  
  setOpenModalTerm(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  setOpenModalPriv(isOpen: boolean){
    this.isModalOpen1 = isOpen;
  }

  abrirWhatsApp() {
    const numero = '5511996923484';
    const mensagem = 'Olá, gostaria de mais informações.';
    const url = `whatsapp://send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_system');
  }


  ngOnInit() {
    this.updateThemeInfo();
    // Escuta mudanças em tempo real
    this.subscription = this.themeService.themeChanged$.subscribe(() => {
      this.updateThemeInfo();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  raioDistancia() {
    const raio = JSON.parse(this.config);
    const distancia = raio.Distancia
    return distancia;
  }
  async irConfig() {
    // Fecha o popover atual antes de navegar
    await this.popoverCtrl.dismiss();
  
    // Navega para a página de configuração
    this.router.navigate(['/config-user']);
  }

  async openThemeSelector() {
    await this.themeActionService.openThemeSelector();
  }

  getCurrentStatus(): string {

    const temaAtual = this.themeService.getCurrentTheme() === 'dark' ? 'Escuro' : 'Claro';



    const mode = this.themeService.getCurrentMode();
    switch (mode) {
      case 'auto': return `Auto (${temaAtual})`;
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      default: return 'Automático';
    }
  }

  private updateThemeInfo() {
    this.themeInfo = this.themeService.getThemeInfo();
    console.log('Tema atualizado:', this.themeInfo);
  }

  irPagina() {

  }

}