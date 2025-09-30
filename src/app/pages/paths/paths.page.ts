import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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
import { ActionSheetController } from '@ionic/angular';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-paths',
  templateUrl: './paths.page.html',
  styleUrls: ['./paths.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    CommonModule, 
    FormsModule, 
    CookieConsentComponent
  ],

})
export class PathsPage implements OnInit, OnDestroy {

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
