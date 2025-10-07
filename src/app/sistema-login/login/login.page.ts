import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButtons, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle
} from '@ionic/angular/standalone';
import { AutenticacaoService } from 'src/app/services/sistema-login/autenticacao';

import { addIcons } from 'ionicons';
import { add, trash, chevronDown, personCircle, lockClosed, person, lockOpen, close } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonButtons, IonButton, IonIcon, CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle]
})
export class LoginPage implements OnInit {
  @ViewChild('inputRef') inputElement: ElementRef | undefined;
  @ViewChild('inputLoginRef') inputLoginRef: ElementRef | undefined;
  @ViewChild('inputSenhaRef') inputSenhaRef: ElementRef | undefined;

  isPasswordVisible = false;
  isAnimating = false;
  public login: string = '';
  public senha: string = '';

  constructor(
    public titleService: Title,
    public autenticacao_service: AutenticacaoService,
    public alertController: AlertController,
    public rt: Router
  ) {
    addIcons({ add, trash, chevronDown, personCircle, lockClosed, person, lockOpen, close });
  }

  ngOnInit() {

    this.titleService.setTitle("Login");

  }

  togglePasswordVisibility() {
    this.isAnimating = true;
    this.isPasswordVisible = !this.isPasswordVisible;

    setTimeout(() => {
      this.isAnimating = false;
    }, 300); // Tempo igual à duração da animação
  }

  esqueciSenha() {
    this.rt.navigateByUrl('/esqueci-senha');
  }

  async logar() {
    let login = this.login;
    let senha = this.senha;

    if (login == '' || login == undefined || login == null || senha == '' || senha == undefined || senha == null) {
      const alert = await this.alertController.create({
        header: 'Preencha os campos corretamente!',
        buttons: [{
          text: 'OK',
          role: 'OK',
          cssClass: 'confirmarAction',
          handler: () => {

          },
        },],
      });

      await alert.present();
    }



    else {
      this.autenticacao_service
    .logar(login, senha)
    .subscribe({
      // 1. CALLBACK DE SUCESSO (next) - Chamado SOMENTE se o HTTP retornar 200/OK
      next: async (_res: any) => {
        if (_res.message == 'Login realizado com sucesso') {
          // Lógica de Sucesso...
          const alert = await this.alertController.create({
            header: 'Login realizado com sucesso!',
            buttons: [{
              text: 'OK',
              role: 'OK',
              cssClass: 'confirmarAction',
              handler: () => {
                console.log(_res);
                localStorage.setItem('token', _res.token);
                localStorage.setItem('nome', _res.nome);
                localStorage.setItem('user', _res.usuario);
                localStorage.setItem('email', _res.email);
                localStorage.setItem('is_master_admin', _res.is_master_admin);
                this.login = "";
                this.senha = '';
                this.rt.navigate(['/path/hospitais']);
              },
            },],
          });
          await alert.present();
        } else {
          // (Este bloco só é atingido se o status HTTP for 200, mas a mensagem for de erro)
          console.log('swzo - Erro Lógico Recebido com Status 200:', _res);
        }
      },
      
      // 2. CALLBACK DE ERRO (error) - Chamado quando o HTTP retorna status 4xx, 5xx, ou falha de rede
      error: async (err: any) => {
        // Seu console.log de teste agora vai aparecer aqui!
        console.log('swzo - Erro HTTP 401 Capturado:', err); 
        
        // Coloque aqui a lógica para mostrar o alerta de erro para o usuário
        const alert = await this.alertController.create({
          header: 'Usuario ou senha inválidos!',
          message: 'Verifique suas credenciais e tente novamente.', // Adicione uma mensagem mais clara
          buttons: [{
            text: 'OK',
            role: 'OK',
            cssClass: 'confirmarAction',
            handler: () => {
              // Limpar campos ou focar no input se necessário
            },
          },],
        });

        await alert.present();
      }
    });
    }
  }

  limparInput(campo: 'login' | 'senha') {
    let inputRef: ElementRef | undefined;

    if (campo === 'login') {
      this.login = '';
      inputRef = this.inputLoginRef;
    }
    else if (campo === 'senha') {
      this.senha = '';
      inputRef = this.inputSenhaRef;
    }

    // Retorna o foco
    if (inputRef && inputRef.nativeElement) {
      inputRef.nativeElement.focus();
    }
  }

}
