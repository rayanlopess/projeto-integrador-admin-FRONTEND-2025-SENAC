import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AlertController } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-inicial',
  templateUrl: './config-inicial.page.html',
  styleUrls: ['./config-inicial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfigInicialPage implements OnInit {
  public range: number = 50;
  public enderecoManual: string = '';
  public class_enderecoManual: string = '';
  public class_error: string = 'ion-touched ion-invalid';
  public usandoLocalizacaoAtual: boolean = false;

  constructor(
    public rt: Router,
    public alertController: AlertController
  ) {
    addIcons({ search })
  }

  ngOnInit() {
  }

  pinFormatter(value: number) {
    return `${value}km`;
  }

  async salvarConfig() {
    // Verifica se o usuário não forneceu nenhuma forma de localização
    if (!this.usandoLocalizacaoAtual && this.enderecoManual.trim() === '') {
      const alert = await this.alertController.create({
        header: `Selecione uma Localização ou Digite uma.`,
        cssClass: 'container-alert',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'cancelarAction',
            handler: () => {
              console.log('Operação cancelada.');
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            cssClass: 'confirmarAction',
            handler: async () => {

            },
          },
        ],
      });

      await alert.present();

    }
    else {
      console.log('Configurações salvas:');
      localStorage.setItem("Distancia", `${this.range}`)

      if (this.usandoLocalizacaoAtual) {
        localStorage.setItem("LocalizacaoAtual", `true`);
        localStorage.setItem("EnderecoManual", "false")
        this.rt.navigate(['/aviso-dados']);
      } else {
        localStorage.setItem("LocalizacaoAtual", `false`);
        localStorage.setItem("EnderecoManual", `${this.enderecoManual}`)
        this.rt.navigate(['/aviso-dados']);
      }
    }
    // Se chegou aqui, pode salvar as configurações


  }

  usarLocalizacaoAtual() {
    this.usandoLocalizacaoAtual = true;
    this.class_enderecoManual = ''; // Remove qualquer erro do campo de endereço manual

    // Aqui você implementaria a lógica para obter a localização atual
    // Por enquanto, vamos apenas simular
    console.log('Obtendo localização atual...');

    // Simulação de obtenção de localização
    setTimeout(() => {
      console.log('Localização obtida com sucesso!');
    }, 1000);
  }
}
