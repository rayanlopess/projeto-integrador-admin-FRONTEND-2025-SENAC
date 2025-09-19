import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-termos-uso',
  templateUrl: './termos-uso.page.html',
  styleUrls: ['./termos-uso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TermosUsoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
