import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-termos-uso',
  templateUrl: './termos-uso.page.html',
  styleUrls: ['./termos-uso.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TermosUsoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
