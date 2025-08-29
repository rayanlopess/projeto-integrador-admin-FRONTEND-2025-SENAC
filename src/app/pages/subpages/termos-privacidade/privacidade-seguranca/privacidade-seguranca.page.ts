import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-privacidade-seguranca',
  templateUrl: './privacidade-seguranca.page.html',
  styleUrls: ['./privacidade-seguranca.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PrivacidadeSegurancaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
