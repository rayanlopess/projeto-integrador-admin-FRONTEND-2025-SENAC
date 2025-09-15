import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle, chevronBack, chevronForward, ellipsisVertical } from 'ionicons/icons';

import { ThemeService, ThemeMode } from '../../../services/theme/theme';
import { AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { DateService } from '../../../services/datetime-service/date-service';



@Component({
  selector: 'app-swipper',
  templateUrl: './swipper.page.html',
  styleUrls: ['./swipper.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwipperPage implements OnInit {

  public data: string = this.dateService.getFormattedDate();



  constructor(
    private themeService: ThemeService,
    public alertController: AlertController,
    private rt: Router,
    private dateService: DateService,
  ) {
    addIcons({ home, map, call, settings, personCircle, chevronBack, chevronForward, ellipsisVertical });
  }



  ngOnInit() {

  }

  onSubmit() {

  }

  //
  public temaAtual: string = this.themeService.getCurrentTheme()
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

  public checkbox: boolean = false;
  public class_error: string = 'ion-touched ion-invalid';
  public isCheckboxInvalid: boolean = false; // Nova variável para controle
  irHome() {
    if (!this.checkbox) {
      this.isCheckboxInvalid = true; // Marca como inválido
      return;
    }

    // Se chegou aqui, checkbox está marcado
    this.isCheckboxInvalid = false; // Remove o erro
    this.rt.navigate(['/config-inicial']);
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

  sairApp() {

  }

}
