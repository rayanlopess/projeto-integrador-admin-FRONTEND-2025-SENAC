import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonThumbnail,
} from '@ionic/angular/standalone';


import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location} from 'ionicons/icons';
import { AlertController, PopoverController, LoadingController, RefresherCustomEvent } from '@ionic/angular/standalone';

import { DateService } from '../../services/datetime-service/date-service';
import { SimplePopoverComponent } from '../../components/simple-popover/simple-popover.component';
import { HospitalService, HospitalProcessado } from '../../services/sistema-hospital/hospital';




@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [ IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonThumbnail, CommonModule, FormsModule]
})
export class UsuariosPage implements OnInit {
  public data: string = this.dateService.getFormattedDate();
  constructor(
    private router: Router,
    private dateService: DateService,
    public alertController: AlertController,
    private popoverCtrl: PopoverController,
    private hospitalService: HospitalService,
    private loadingController: LoadingController
  ) {
    addIcons({ home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location});

   }

  ngOnInit() {
  }
  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: SimplePopoverComponent,
      event
    });
    await popover.present();
  }

}
