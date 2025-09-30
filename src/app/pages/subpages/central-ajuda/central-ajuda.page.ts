import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  // Mantemos as importações dos componentes Ionic, mas corrigimos o problema de resolução.
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonThumbnail,
  AlertController
} from '@ionic/angular/standalone';

import { Location } from '@angular/common'; 
import { Router } from '@angular/router';


import { addIcons } from 'ionicons';
import { sunny, moon, phonePortrait, close, arrowBackOutline, search, trash} from 'ionicons/icons';


@Component({
  selector: 'app-central-ajuda',
  templateUrl: './central-ajuda.page.html',
  styleUrls: ['./central-ajuda.page.scss'],
  standalone: true,
  imports: [  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonThumbnail, 
  CommonModule, 
  FormsModule
]
})
export class CentralAjudaPage implements OnInit {

  constructor(
    private router: Router, 
    private location: Location
  ) { 
    addIcons({ sunny, moon, phonePortrait, close, arrowBackOutline, search, trash });
  }

  ngOnInit() {
  }
  voltar() {
    this.location.back();
  }
}
