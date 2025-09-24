import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aviso-dados',
  templateUrl: './aviso-dados.page.html',
  styleUrls: ['./aviso-dados.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AvisoDadosPage implements OnInit {

  constructor(
    public rt: Router
  ) {
    addIcons({ search })
  }

  ngOnInit() {
  }
  
}
