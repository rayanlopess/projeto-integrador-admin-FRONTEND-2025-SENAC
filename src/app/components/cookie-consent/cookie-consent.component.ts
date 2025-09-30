import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sunny, moon, phonePortrait, close, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss'],
  standalone: true,
  imports: [CommonModule,  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol] // Importe o CommonModule para usar o *ngIf
})
export class CookieConsentComponent implements OnInit {

  showConsent = false;
isModalOpen = false;

  constructor() {
    addIcons({ sunny, moon, phonePortrait, close, arrowBackOutline });
   }

  ngOnInit() {
    // Verifica se o usuário já aceitou os cookies
    const consentGiven = localStorage.getItem('cookies-accepted');
    if (!consentGiven) {
      this.showConsent = true;
    }
  }

  acceptCookies() {
    // Esconde o aviso e salva a preferência do usuário
    localStorage.setItem('cookies-accepted', 'true');
    this.showConsent = false;
  }

  setOpenModalTerm(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}