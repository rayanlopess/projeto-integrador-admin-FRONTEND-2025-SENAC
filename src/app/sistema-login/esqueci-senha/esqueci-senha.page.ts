import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { EsqueciSenhaService } from 'src/app/services/sistema-login/esqueci-senha';

import { addIcons } from 'ionicons';
import { add, trash, chevronDown, personCircle, lockClosed, person, lockOpen, close } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.page.html',
  styleUrls: ['./esqueci-senha.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonBackButton, IonIcon]
})
export class EsqueciSenhaPage implements OnInit {
  @ViewChild('inputRef') inputElement: ElementRef | undefined;
  @ViewChild('inputEmailRef') inputEmailRef: ElementRef | undefined;
  public email: string = '';
  constructor(
    public amnesia_senha_service: EsqueciSenhaService,
    public alertController: AlertController,
    public rt: Router
  ) {
    addIcons({ add, trash, chevronDown, personCircle, lockClosed, person, lockOpen, close });
  }

  ngOnInit() {
  }

  limparInput(campo: 'email') {
    let inputRef: ElementRef | undefined;

    if (campo === 'email') {
      this.email = '';
      inputRef = this.inputEmailRef;
    }


    // Retorna o foco
    if (inputRef && inputRef.nativeElement) {
      inputRef.nativeElement.focus();
    }
  }

  async enviarRecSenha() {
    let email = this.email;


    if (email == '' || email == undefined || email == null) {
      const alert = await this.alertController.create({
        header: 'Preencha os campos corretamente!',
        buttons: [{
          text: 'OK',
          role: 'OK',
          handler: () => {

          },
        },],
      });

      await alert.present();
    }
    else {
      this.amnesia_senha_service
        .esqueciSenha(email)
        .subscribe({
          // 1. CALLBACK DE SUCESSO (next) - Chamado SOMENTE se o HTTP retornar 200/OK
          next: async (_res: any) => {
            if (_res.message == "Caso exista, email enviado") {
              
              const alert = await this.alertController.create({
                header: `Enviamos as instruções de recuperação de senha para o seu e-mail.`,
                buttons: [{
                  text: 'OK',
                  role: 'OK',
                  handler: () => {
                    
                    this.rt.navigate(['/login']);
                  },
                },],
              });
              await alert.present();
            } else {


            }
          },

          // 2. CALLBACK DE ERRO (error) - Chamado quando o HTTP retorna status 4xx, 5xx, ou falha de rede
          error: async (err: any) => {
            const alert = await this.alertController.create({
              header: 'Erro interno!',// Adicione uma mensagem mais clara
              buttons: [{
                text: 'OK',
                role: 'OK',
                handler: () => {
                  console.log(err)
                },
              },],
            });

            await alert.present();
          }
        });
    }
  }

}
