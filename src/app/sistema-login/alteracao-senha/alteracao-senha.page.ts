import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-alteracao-senha',
  templateUrl: './alteracao-senha.page.html',
  styleUrls: ['./alteracao-senha.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AlteracaoSenhaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
