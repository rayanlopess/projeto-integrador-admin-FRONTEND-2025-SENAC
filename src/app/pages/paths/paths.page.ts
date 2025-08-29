import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


import { addIcons } from 'ionicons';
import { home, map, call, settings } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AlertController, IonRouterLink, NavController } from '@ionic/angular/standalone';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-paths',
  templateUrl: './paths.page.html',
  styleUrls: ['./paths.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, FormsModule]
})
export class PathsPage implements OnInit {
  activeTab: string = 'home';
  constructor(
    private router: Router,
    public titleService: Title,
    private navCtrl: NavController
  ) {
    addIcons({ home, map, call, settings });

    
  }

  ngOnInit() {
  
  }



 


}
