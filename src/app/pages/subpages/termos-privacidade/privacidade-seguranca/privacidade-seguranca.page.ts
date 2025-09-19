import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-privacidade-seguranca',
  templateUrl: './privacidade-seguranca.page.html',
  styleUrls: ['./privacidade-seguranca.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PrivacidadeSegurancaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
