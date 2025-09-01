import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

import { Title } from '@angular/platform-browser';

import { DateService } from '../../services/datetime-service/date-service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  public upa:string = 'UPA Rio Maina'
  public usuario: string = "Julia";
  public tempo:string = "10 min";
  public data: string = this.dateService.getFormattedDate();

  constructor(
    private router: Router,
    public titleService: Title,
    private dateService: DateService,
    public alertController: AlertController
  ) {
    addIcons({ home, map, call, settings, personCircle });
  }

  ngOnInit() {

  }


  async irHospital() {

    const alert = await this.alertController.create({
      header: `Deseja realmente ir até ${this.upa}`,
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
          text: 'OK',
          role: 'confirm',
          cssClass: 'confirmarAction',
          handler: async () => {
            
          },
        },
      ],
    });

    await alert.present();

    
  }


}
