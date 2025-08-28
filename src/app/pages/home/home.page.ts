import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

import { Title } from '@angular/platform-browser';

import { DateService } from '../../services/datetime-service/date-service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit  {

  public usuario:string = "Julia";
  public data:string = this.dateService.getFormattedDate();

  constructor(
    private router: Router,
    public titleService: Title,
    private dateService: DateService,
  ) {
    addIcons({ home, map, call, settings, personCircle });
  }

  ngOnInit() {
  
  }

  

}
