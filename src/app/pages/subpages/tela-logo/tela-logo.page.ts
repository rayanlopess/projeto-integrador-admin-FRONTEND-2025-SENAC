import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tela-logo',
  templateUrl: './tela-logo.page.html',
  styleUrls: ['./tela-logo.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class TelaLogoPage implements AfterViewInit {



  constructor(private router: Router) { }

  ngAfterViewInit() {
    this.addHealthEffects();

    // Tempo ideal para splash screen (3 segundos)
    setTimeout(() => {
      this.navigateToHome();
    }, 3000);
  }

  private addHealthEffects() {
    const container = document.getElementById('splashContainer');
    if (!container) return;

    // Adiciona efeitos discretos de batimento cardíaco
    for (let i = 0; i < 3; i++) {
      const heartbeat = document.createElement('div');
      heartbeat.className = 'heartbeat';

      // Posições aleatórias mas equilibradas
      const positions = [
        { top: '30%', left: '30%' },
        { top: '60%', left: '70%' },
        { top: '45%', left: '50%' }
      ];

      heartbeat.style.cssText = `
        top: ${positions[i].top};
        left: ${positions[i].left};
        animation-delay: ${i * 1.5}s;
      `;

      container.appendChild(heartbeat);
    }
  }

  private async navigateToHome() {
    const container = document.querySelector('.div-img-tela-logo');
    if (container) {
      container.classList.add('exiting');

      // Aguarda a animação de saída terminar
      await new Promise(resolve => setTimeout(resolve, 1000));

      const isFirstTime = localStorage.getItem("isFirstTime");
      if (isFirstTime === "false") {
        this.router.navigate(['/path/home'], {
          replaceUrl: true
        });
      }
      else{
        this.router.navigate(['/swipper'], {
          replaceUrl: true
        });
      }

    }
  }
}
