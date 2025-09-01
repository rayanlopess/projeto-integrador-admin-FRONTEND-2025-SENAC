import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ThemeActionService } from '../../services/theme/theme-action';
import { ThemeService, ThemeMode } from '../../services/theme/theme';

import { addIcons } from 'ionicons';
import { sunny, moon, phonePortrait, close } from 'ionicons/icons';

import { Subscription } from 'rxjs';



@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfiguracoesPage implements OnInit, OnDestroy  {
 themeInfo: any;
  private subscription!: Subscription;

  constructor(
    private themeActionService: ThemeActionService,
    private themeService: ThemeService
  ) {
      addIcons({ sunny, moon, phonePortrait, close });
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

  irPagina(){
    
  }

}
