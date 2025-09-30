// src/app/services/theme-action.service.ts
import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular/standalone';
import { ThemeService, ThemeMode } from './theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeActionService {

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private themeService: ThemeService
  ) {}

  async openThemeSelector() {
    const currentMode = this.themeService.getCurrentMode();
    const currentTheme = this.themeService.getCurrentTheme();

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecionar Tema',
      subHeader: this.getSubHeader(currentMode, currentTheme),
      buttons: [
        {
          text: `Automático ${currentMode === 'auto' ? '✓' : ''}`,
          icon: 'invert-mode',
          data: 'auto',
          role: currentMode === 'auto' ? 'selected' : undefined,
          handler: () => {
            this.themeService.setTheme('auto');
          }
        },
        {
          text: `Claro ${currentMode === 'light' ? ' ✓' : ''}`,
          icon: 'sunny',
          data: 'light',
          role: currentMode === 'light' ? 'selected' : undefined,
          handler: () => {
            this.themeService.setTheme('light');
          }
        },
        {
          text: `Escuro ${currentMode === 'dark' ? '✓' : ''}`,
          icon: 'moon',
          data: 'dark',
          role: currentMode === 'dark' ? 'selected' : undefined,
          handler: () => {
            this.themeService.setTheme('dark');
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          cssClass: 'cancelarAction'
        }
      ]
    });

    await actionSheet.present();
  }

  private getSubHeader(mode: ThemeMode, theme: 'light' | 'dark'): string {
    switch (mode) {
      case 'auto':
        return `Modo automático (Sistema: ${theme === 'dark' ? 'Escuro' : 'Claro'})`;
      case 'light':
        return 'Modo claro selecionado';
      case 'dark':
        return 'Modo escuro selecionado';
      default:
        return 'Selecionar tema';
    }
  }
}