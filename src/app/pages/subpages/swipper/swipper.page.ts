import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle, chevronBack, chevronForward } from 'ionicons/icons';

import { ThemeService, ThemeMode } from '../../../services/theme/theme';
import { AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';


@Component({
  selector: 'app-swipper',
  templateUrl: './swipper.page.html',
  styleUrls: ['./swipper.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwipperPage implements OnInit {


  constructor(
        private themeService: ThemeService,
        public alertController: AlertController,
        private rt: Router
  ) {
    addIcons({ home, map, call, settings, personCircle, chevronBack, chevronForward });
   }
  
   public temaAtual:string = this.themeService.getCurrentTheme()

  ngOnInit() {
    
  }

  currentIndex = 0;
  pages = Array(7).fill(0); // 7 páginas

  goToNext() {
    if (this.currentIndex < 6) {
      this.currentIndex++;
    }
  }

  goToPrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  irHome(){
    this.rt.navigate(['/path/home']);
  }

  async pularHome() {

    const alert = await this.alertController.create({
      header: `Deseja pular a apresentação e ir até a página inicial?`,
      cssClass: 'container-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancelarAction',
          handler: () => {
            console.log('Operação cancelada.');
          },
        },
        {
          text: 'Sim',
          role: 'confirm',
          cssClass: 'confirmarAction',
          handler: async () => {
            this.rt.navigate(['/path/home']);
          },
        },
      ],
    });

    await alert.present(); 
  }

  sairApp(){
   
  }

}
