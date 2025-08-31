import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle, chevronBack, chevronForward } from 'ionicons/icons';

@Component({
  selector: 'app-swipper',
  templateUrl: './swipper.page.html',
  styleUrls: ['./swipper.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwipperPage implements OnInit {

  constructor() {
    addIcons({ home, map, call, settings, personCircle, chevronBack, chevronForward });
   }
  

  ngOnInit() {
  }

    currentIndex = 0;
  pages = Array(7).fill(0); // 7 páginas

  goToNext() {
    if (this.currentIndex < 6) {
      this.currentIndex++;
    }
  }

  goToPrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
