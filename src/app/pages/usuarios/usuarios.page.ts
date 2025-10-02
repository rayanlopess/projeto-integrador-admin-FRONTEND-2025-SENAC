import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonThumbnail,
  IonRippleEffect,
  IonFab,
  IonFabButton,
  IonFabList,
  IonModal,
  IonInput,
  IonLabel,
  IonDatetime,
  IonDatetimeButton

} from '@ionic/angular/standalone';


import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location, create, chevronUp, add, trash, lockClosed, lockOpen, closeCircle, document } from 'ionicons/icons';
import { AlertController, PopoverController, LoadingController, RefresherCustomEvent } from '@ionic/angular/standalone';

import { DateService } from '../../services/datetime-service/date-service';
import { SimplePopoverComponent } from '../../components/simple-popover/simple-popover.component';
import { HospitalService, HospitalProcessado } from '../../services/sistema-hospital/hospital';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DataValidator } from '../../directives/data-validator'; 

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonRippleEffect,
    IonFab,
    IonFabButton,
    IonFabList,
    CommonModule,
    FormsModule,
    IonModal,
    IonInput,
    NgxMaskDirective,
    DataValidator,
    IonLabel, 
    IonDatetime,
    IonDatetimeButton
  ],
  providers: [provideNgxMask()] 
})
export class UsuariosPage implements OnInit {

  @ViewChild('inputRef') inputElement: ElementRef | undefined;

  public data: string = this.dateService.getFormattedDate();
  public nomeHospital: string = '';
  isPasswordVisible = false;
  isAnimating = false;

 @ViewChild('inputNomeCompletoRef') inputNomeCompletoRef: ElementRef | undefined;
  @ViewChild('inputDataNascimentoRef') inputDataNascimentoRef: ElementRef | undefined;
   @ViewChild('inputCpfRef') inputCpfRef: ElementRef | undefined;
  @ViewChild('inputEmailRef') inputEmailRef: ElementRef | undefined;
  @ViewChild('inputNomeUsuarioRef') inputNomeUsuarioRef: ElementRef | undefined;
  @ViewChild('inputSenhaRef') inputSenhaRef: ElementRef | undefined;

  public nomeCompleto: string = '';
  dataNascimento: string | null = null; 
  public cpf: string = '';
  public email: string = '';
  public nomeUsuario: string = '';
  public senha: string = '';

  constructor(
    private router: Router,
    private dateService: DateService,
    public alertController: AlertController,
    private popoverCtrl: PopoverController,
    private hospitalService: HospitalService,
    private loadingController: LoadingController
  ) {
    addIcons({ home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location, create, chevronUp, add, trash, lockClosed, lockOpen, closeCircle, document });

  }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.isAnimating = true;
    this.isPasswordVisible = !this.isPasswordVisible;

    setTimeout(() => {
      this.isAnimating = false;
    }, 300); // Tempo igual à duração da animação
  }

   limparInput(campo: 'nomeCompleto' | 'dataNascimento' | 'cpf' | 'email' | 'nomeUsuario' | 'senha') {
        let inputRef: ElementRef | undefined;

        if (campo === 'nomeCompleto') {
            this.nomeCompleto = '';
            inputRef = this.inputNomeCompletoRef;
        } 
        else if (campo === 'dataNascimento') {
            this.dataNascimento = '';
            inputRef = this.inputDataNascimentoRef;
        }
        else if (campo === 'cpf') {
            this.cpf = '';
            inputRef = this.inputCpfRef;
        }
        else if (campo === 'email') {
            this.email = '';
            inputRef = this.inputEmailRef;
        }
        else if (campo === 'nomeUsuario') {
            this.nomeUsuario = '';
            inputRef = this.inputNomeUsuarioRef;
        }
        else if (campo === 'senha') {
            this.senha = '';
            inputRef = this.inputSenhaRef;
        }

        // Retorna o foco
        if (inputRef) {
            inputRef.nativeElement.focus();
        }
    }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: SimplePopoverComponent,
      event
    });
    await popover.present();
  }
  isModalOpenAdd = false;

  setOpenAdd(isOpen: boolean) {
    this.isModalOpenAdd = isOpen;
  }
  isModalOpenEdit = false;

  setOpenEdit(isOpen: boolean) {
    this.isModalOpenEdit = isOpen;
  }
  salvarConfig() {

  }

}
