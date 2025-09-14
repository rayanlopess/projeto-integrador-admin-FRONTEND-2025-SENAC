import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';

@Component({
  selector: 'app-config-inicial',
  templateUrl: './config-inicial.page.html',
  styleUrls: ['./config-inicial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfigInicialPage implements OnInit {
  public range: number = 50;
  constructor() {
    addIcons({ search })
  }

  ngOnInit() {

  }

  pinFormatter(value: number) {
    return `${value}km`;
  }

  salvarConfig() {
    console.log(this.range)
  }

}
