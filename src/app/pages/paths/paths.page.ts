import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


import { addIcons } from 'ionicons';
import { home, map, call, settings, ellipsisVertical } from 'ionicons/icons';
import { Router, NavigationEnd } from '@angular/router';
import { PopoverController, NavController } from '@ionic/angular/standalone';

import { Title } from '@angular/platform-browser';

import { DateService } from '../../services/datetime-service/date-service'

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SimplePopoverComponent } from '../../components/simple-popover/simple-popover.component';

import { Popover } from '../../services/popover/popover';

import { CookieConsentComponent } from '../../components/cookie-consent/cookie-consent.component';

@Component({
  selector: 'app-paths',
  templateUrl: './paths.page.html',
  styleUrls: ['./paths.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, FormsModule, CookieConsentComponent], 

})
export class PathsPage implements OnInit, OnDestroy{

  activeTab: string = 'home';

  constructor(
    private router: Router,
    public titleService: Title,
    private navCtrl: NavController, 
    private popoverCtrl: PopoverController,
    private date: DateService
  ) {
    addIcons({ home, map, call, settings, ellipsisVertical });

  
  }
   ngOnInit() {
   
  }



  ngOnDestroy() {
   
  
  }


  
}
