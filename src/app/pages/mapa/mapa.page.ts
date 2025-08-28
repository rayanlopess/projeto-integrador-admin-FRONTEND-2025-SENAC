import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle } from 'ionicons/icons';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MapaPage implements OnInit {

  constructor() { 
    addIcons({ home, map, call, settings, personCircle });
  }

  ngOnInit() {
  }

}
