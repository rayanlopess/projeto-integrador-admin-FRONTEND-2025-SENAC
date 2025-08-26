import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-validacao-email',
  templateUrl: './validacao-email.page.html',
  styleUrls: ['./validacao-email.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ValidacaoEmailPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
