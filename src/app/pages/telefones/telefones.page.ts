import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle, warningOutline, invertMode } from 'ionicons/icons';
import { SimplePopoverComponent } from '../../components/simple-popover/simple-popover.component';
import { AlertController, PopoverController} from '@ionic/angular/standalone';

@Component({
  selector: 'app-telefones',
  templateUrl: './telefones.page.html',
  styleUrls: ['./telefones.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TelefonesPage implements OnInit {

  constructor(
    public alertController: AlertController,
    private popoverCtrl: PopoverController
  ) { 
    addIcons({ home, map, call, settings, personCircle, warningOutline, invertMode });
  }

  ngOnInit() {
  }

  async presentPopover(event: Event){
    const popover = await this.popoverCtrl.create({
      component: SimplePopoverComponent,
      event
    })
    await popover.present();
  }

}
