import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


import { addIcons } from 'ionicons';
import { home, map, call, settings } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-paths',
  templateUrl: './paths.page.html',
  styleUrls: ['./paths.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PathsPage implements OnInit {


  constructor(
    private router: Router,
    public titleService: Title,
  ) {
    addIcons({ home, map, call, settings });
  }

  ngOnInit() {
  
  }


}
