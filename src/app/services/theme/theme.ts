// src/app/services/theme.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'auto' | 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  private currentMode: ThemeMode = 'auto';
  private themeChanged = new BehaviorSubject<ThemeMode>('auto');
  
  public themeChanged$ = this.themeChanged.asObservable();
  private mediaQueryListener?: () => void;

  constructor() {
    this.loadTheme();
    this.setupSystemThemeListener();
  }

  ngOnDestroy() {
    if (this.mediaQueryListener) {
      this.mediaQueryListener();
    }
  }

  private loadTheme() {
    try {
      const savedMode = localStorage.getItem('user_theme') as ThemeMode;
      if (savedMode) {
        this.currentMode = savedMode;
      }
      this.applyTheme();
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      this.currentMode = 'auto';
      this.applyTheme();
    }
  }

  private setupSystemThemeListener() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Listener para mudanças do sistema
      const listener = (e: MediaQueryListEvent) => {
        if (this.currentMode === 'auto') {
          this.applyTheme();
          this.themeChanged.next('auto');
        }
      };
      
      mediaQuery.addEventListener('change', listener);
      
      // Cleanup function
      this.mediaQueryListener = () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }
  }

  private applyTheme() {
    const themeToApply = this.getThemeToApply();
    
    // Aplica no documento - isso vai triggerar o Ionic automaticamente
    if (themeToApply === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // Força o Ionic a detectar a mudança
    this.forceIonicThemeUpdate();
  }

  private getThemeToApply(): 'light' | 'dark' {
    if (this.currentMode === 'auto') {
      return this.getSystemTheme();
    }
    return this.currentMode;
  }

  private getSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private forceIonicThemeUpdate() {
    // Dispara um evento customizado para forçar o Ionic a atualizar
    window.dispatchEvent(new CustomEvent('ionThemeChange'));
  }

  setTheme(mode: ThemeMode) {
    this.currentMode = mode;
    this.applyTheme();
    this.saveTheme();
    this.themeChanged.next(mode);
  }

  private saveTheme() {
    try {
      localStorage.setItem('user_theme', this.currentMode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  }

  getCurrentMode(): ThemeMode {
    return this.currentMode;
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.getThemeToApply();
  }

  getThemeInfo() {
    return {
      mode: this.currentMode,
      appliedTheme: this.getCurrentTheme(),
      systemTheme: this.getSystemTheme(),
      isAuto: this.currentMode === 'auto'
    };
  }
}