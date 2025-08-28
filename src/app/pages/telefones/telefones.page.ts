import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle } from 'ionicons/icons';

@Component({
  selector: 'app-telefones',
  templateUrl: './telefones.page.html',
  styleUrls: ['./telefones.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TelefonesPage implements OnInit {

  constructor() { 
    addIcons({ home, map, call, settings, personCircle });
  }

  ngOnInit() {
  }

}
