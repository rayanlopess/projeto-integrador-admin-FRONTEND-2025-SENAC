import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tela-logo',
  templateUrl: './tela-logo.page.html',
  styleUrls: ['./tela-logo.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TelaLogoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
