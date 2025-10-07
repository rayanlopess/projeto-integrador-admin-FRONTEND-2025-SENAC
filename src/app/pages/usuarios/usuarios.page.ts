import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
  IonDatetimeButton,
  LoadingController,
  AlertController,
  PopoverController
} from '@ionic/angular/standalone';


import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location, create, chevronUp, add, trash, lockClosed, lockOpen, closeCircle, document, ellipsisVertical } from 'ionicons/icons';

import { DateService } from '../../services/datetime-service/date-service';
import { SimplePopoverComponent } from '../../components/simple-popover/simple-popover.component';
// Importação mockada - Substitua pelo seu caminho real
import { HospitalService, HospitalProcessado } from '../../services/sistema-hospital/hospital';
import { UserService, User } from '../../services/user/user'; // Novo Service

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DataValidator } from '../../directives/data-validator';
import { Inject } from '@angular/core';

import { RefresherEventDetail } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme/theme';

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
  providers: [provideNgxMask(), UserService] // Adicionado UserService
})
export class UsuariosPage implements OnInit, OnDestroy {

  // Referências do DOM (já estavam)
  @ViewChild('inputRef') inputElement: ElementRef | undefined;
  @ViewChild('inputNomeCompletoRef') inputNomeCompletoRef: ElementRef | undefined;
  @ViewChild('inputDataNascimentoRef') inputDataNascimentoRef: ElementRef | undefined;
  @ViewChild('inputCpfRef') inputCpfRef: ElementRef | undefined;
  @ViewChild('inputEmailRef') inputEmailRef: ElementRef | undefined;
  @ViewChild('inputNomeUsuarioRef') inputNomeUsuarioRef: ElementRef | undefined;
  @ViewChild('inputSenhaRef') inputSenhaRef: ElementRef | undefined;

  // Propriedades de Estado do Componente
  public data: string = this.dateService.getFormattedDate();
  public carregando: boolean = false;
  public erroCarregamento: boolean = false;

  // Lista de Usuários
  public users: User[] = [];
  public selectedUser: User | null = null; // Usuário para edição

  // Variáveis de Modo de Interação
  public isEditingMode: boolean = false; // Controla se o modo de edição está ativo
  public isDeletingMode: boolean = false; // Controla se o modo de exclusão está ativo


  get pageTitle(): string {
    if (this.isEditingMode) {
      return 'Modo de Edição Ativo';
    }
    if (this.isDeletingMode) {
      return 'Modo de Exclusão Ativo';
    }
    // 3. Lê o valor do 'user' diretamente no getter, garantindo o dado mais recente.
    const usuarioTile = localStorage.getItem('user') || 'Usuário';
    return `Bem-Vindo, ${usuarioTile}`;
  }

  private storageChangeListener = this.handleStorageChange.bind(this);

  private handleStorageChange(event: StorageEvent): void {
    // Verifica se a chave 'user' foi afetada.
    if (event.key === 'user' || event.key === 'token' || event.key === 'is_master_admin') {
      // Força o Angular a verificar novamente o getter pageTitle.
      this.cd.detectChanges();
    }


  }

  // Variáveis do Modal de Cadastro/Edição
  isPasswordVisible = false;
  isAnimating = false;
  public nomeCompleto: string = '';
  public dataNascimento: string | null = null;
  public cpf: string = '';
  public email: string = '';
  public nomeUsuario: string = '';
  public senha: string = '';
  isModalOpenAdd = false;
  isModalOpenEdit = false;

  public is_master_admin: string = localStorage.getItem('is_master_admin') || '';


  public token = localStorage.getItem('token') || '';

  anoMaximo: string = this.dateService.getFormattedDateShort();

  temaAtual: string = this.themeService.getCurrentTheme();

  corDoDatepicker: string = this.atualizarCor();

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private dateService: DateService,
    public alertController: AlertController,
    private popoverCtrl: PopoverController,
    private loadingController: LoadingController,
    // Injetando o novo serviço
    @Inject(UserService) private userService: UserService,
    private cd: ChangeDetectorRef,


  ) {
    addIcons({ home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location, create, chevronUp, add, trash, lockClosed, lockOpen, closeCircle, document, ellipsisVertical });
  }

  ngOnInit() {
    window.addEventListener('storage', this.storageChangeListener);
    this.loadUsers();
    console.log(this.corDoDatepicker);
  }
  ngOnDestroy() {
    window.removeEventListener('storage', this.storageChangeListener);
  }
  handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    this.loadUsers()
      .then(() => event.detail.complete())
      .catch(() => event.detail.complete());
  }
  atualizarCor() {
    const temaAtual = this.temaAtual; // Use o método real do seu serviço

    if (temaAtual === 'dark') {
      return this.corDoDatepicker = 'light'; // Se o app é escuro, a cor do componente é clara
    } else {

      return this.corDoDatepicker = 'filamed-blue'; // Se o app é claro, a cor do componente é filamed-blue
    }

  }

  async loadUsers() {


    this.carregando = true;
    this.erroCarregamento = false;

    try {
      this.users = await this.userService.getAllUsers(this.token);

      sessionStorage.setItem('users', JSON.stringify(this.users));

      this.erroCarregamento = false;
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      this.erroCarregamento = true;
      this.users = [];

    } finally {
      this.carregando = false;

    }
  }

  // --- Lógica de Modos (Edição/Deleção) ---


  async toggleMode(mode: 'edit' | 'delete') {
    if (mode === 'edit') {
      if (sessionStorage.getItem('users') == '[{"id":1,"nome":"Admin do FilaMed","usuario":"FilaMedAdmin","nascimento":"2000-01-01","cpf":"000.000.001-01","email":"noreplyfilamedpi@gmail.com","senha":""}]') {
        const alert = await this.alertController.create({
          header: `Não há hospitais cadastrados para editar!`,
          buttons: [
            { text: 'ok', role: 'ok', cssClass: 'confirmarAction' },
          ],
        });
        await alert.present();
        return;
      }
      this.isDeletingMode = false;
      this.isEditingMode = !this.isEditingMode;
    } else if (mode === 'delete') {
      if (sessionStorage.getItem('users') == '[{"id":1,"nome":"Admin do FilaMed","usuario":"FilaMedAdmin","nascimento":"2000-01-01","cpf":"000.000.001-01","email":"noreplyfilamedpi@gmail.com","senha":""}]') {
        const alert = await this.alertController.create({
          header: `Não há hospitais cadastrados para deletar!`,
          buttons: [
            { text: 'ok', role: 'ok', cssClass: 'confirmarAction' },
          ],
        });
        await alert.present();
        return;
      }
      this.isEditingMode = false;
      this.isDeletingMode = !this.isDeletingMode;
    }
  }
  exitMode() {
    this.isEditingMode = false;
    this.isDeletingMode = false;
  }

  // --- Lógica dos Modais (Add/Edit) ---


  setOpenAdd(isOpen: boolean) {
    this.isModalOpenAdd = isOpen;
    if (isOpen) {
      this.clearForm();
    }
  }


  setOpenEdit(isOpen: boolean, user: User | null = null) {
    this.isModalOpenEdit = isOpen;
    this.selectedUser = user;

    if (isOpen && user) {
      this.fillForm(user);
    } else if (!isOpen) {
      this.clearForm();
      // NÃO SAIR do modo de edição aqui
    }
  }


  fillForm(user: User) {
    this.nomeCompleto = user.nome;
    this.dataNascimento = user.nascimento;
    this.cpf = user.cpf;
    this.email = user.email;
    this.nomeUsuario = user.usuario;
    this.senha = '';
    console.log('Data de Nascimento do Backend:', user.nascimento);
    console.log('Variável this.dataNascimento:', this.dataNascimento);
  }

  clearForm() {
    this.nomeCompleto = '';
    this.dataNascimento = null;
    this.cpf = '';
    this.email = '';
    this.nomeUsuario = '';
    this.senha = '';
  }

  // --- Lógica de Persistência (Salvar/Deletar) ---

  /**
   * Cria ou edita um usuário baseado no modal aberto.
   */
  async salvarConfig() {

    try {
      const userData: Omit<User, 'id'> = {
        email: this.email,
        usuario: this.nomeUsuario,
        senha: this.senha,
        nome: this.nomeCompleto,
        cpf: this.cpf,
        nascimento: this.dataNascimento
      };
      const userDataEdit: Omit<User, 'id'> = {
        email: this.email,
        usuario: this.nomeUsuario,
        senha: this.senha,
        nome: this.nomeCompleto,
        cpf: this.cpf,
        nascimento: this.dataNascimento
      };

      if (this.selectedUser) {
        // Modo Edição
        if (this.nomeUsuario == "" || this.nomeUsuario == null || this.nomeUsuario == undefined || this.nomeCompleto == "" || this.nomeCompleto == null || this.nomeCompleto == undefined || this.email == "" || this.email == null || this.email == undefined || this.cpf == "" || this.cpf == null || this.cpf == undefined || this.dataNascimento == "" || this.dataNascimento == null || this.dataNascimento == undefined) {
          const alert = await this.alertController.create({
            header: `Preencha os campos corretamente`,
            buttons: [
              { text: 'ok', role: 'ok', cssClass: 'confirmarAction' },
            ],
          });
          await alert.present();
          return;
        }

        const loading = await this.loadingController.create({
          message: 'Salvando usuário...',
          spinner: 'lines',
        });
        await loading.present();
        try {
          await this.userService.updateUser({ ...userDataEdit, id: this.selectedUser.id }, this.token);
          this.setOpenEdit(false);
          this.presentAlert('Sucesso!', 'Usuário atualizado com sucesso!');
          await this.exitMode();
        }
        catch (error) {
          console.log(error)
        }
        finally {
          loading.dismiss();
        }

      }
      else {
        // Modo Cadastro
        if (this.nomeUsuario == "" || this.nomeUsuario == null || this.nomeUsuario == undefined || this.nomeCompleto == "" || this.nomeCompleto == null || this.nomeCompleto == undefined || this.senha == "" || this.senha == null || this.senha == undefined || this.email == "" || this.email == null || this.email == undefined || this.cpf == "" || this.cpf == null || this.cpf == undefined || this.dataNascimento == "" || this.dataNascimento == null || this.dataNascimento == undefined) {
          const alert = await this.alertController.create({
            header: `Preencha os campos corretamente`,
            buttons: [
              { text: 'ok', role: 'ok', cssClass: 'confirmarAction' },
            ],
          });
          await alert.present();
          return;
        }

        const loading = await this.loadingController.create({
          message: 'Salvando usuário...',
          spinner: 'lines',
        });
        await loading.present();

        try {
          await this.userService.createUser(userData, this.token);
          this.setOpenAdd(false);
          this.presentAlert('Sucesso!', 'Usuário cadastrado com sucesso!');
        }
        catch (error) {
          console.log(error);
        }
        finally{
          loading.dismiss()
        }
      }

      // Recarrega a lista após a operação
      await this.loadUsers();

    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      this.presentAlert('Erro', 'Não foi possível salvar o usuário. Verifique os dados e tente novamente.');
    }
  }

  /**
   * Deleta um usuário após confirmação.
   * @param user O usuário a ser deletado.
   */
  async deleteUser(user: User) {

    const alert = await this.alertController.create({
      header: `Tem certeza que deseja deletar ${user.usuario}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: "confirmarAction"
        },
        {
          text: 'Deletar',
          cssClass: "cancelarAction",
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Deletando usuário...',
              spinner: 'dots',
            });
            await loading.present();

            try {
              await this.userService.deleteUser(user.id, this.token);
              await this.loadUsers();
              this.presentAlert('Sucesso!', 'Usuário deletado com sucesso!');
              await this.exitMode()
            } catch (error) {
              console.error('Erro ao deletar usuário:', error);
              this.presentAlert('Erro', 'Não foi possível deletar o usuário.');
            } finally {
              loading.dismiss();
            }
          },
        },
      ],
    });

    await alert.present();
  }


  viewUserDetails(user: User) {
    if (this.isEditingMode || this.isDeletingMode) {
      // Se estiver em modo de edição/deleção, a ação é pelo botão de canto.
      return;
    }
    // Implementar aqui a lógica de visualização de detalhes
    this.presentAlert('Detalhes do Usuário', `Nome Completo: ${user.nome} ` + `\n` + `Nome de Usuário: ${user.usuario}`);
  }


  // --- Métodos de Utilidade (já existentes) ---

  togglePasswordVisibility() {
    this.isAnimating = true;
    this.isPasswordVisible = !this.isPasswordVisible;

    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  limparInput(campo: 'nomeCompleto' | 'dataNascimento' | 'cpf' | 'email' | 'nomeUsuario' | 'senha') {
    let inputRef: ElementRef | undefined;

    if (campo === 'nomeCompleto') {
      this.nomeCompleto = '';
      inputRef = this.inputNomeCompletoRef;
    }
    else if (campo === 'dataNascimento') {
      this.dataNascimento = null; // Alterado para null
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
    if (inputRef && inputRef.nativeElement) {
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

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [

        {
          text: 'ok',
          role: 'ok',
          cssClass: 'confirmarAction',
          handler: () => {

          },
        }
      ],

    });
    await alert.present();
  }

  formatarData(event: any) {
    // O valor bruto (value) do evento vem como "YYYY-MM-DDTXX:XX:XX"
    const valorCompleto: string = event.detail.value;

    if (valorCompleto) {
      // Pegamos a substring da data (os primeiros 10 caracteres: YYYY-MM-DD)
      const dataFormatada: string = valorCompleto.substring(0, 10);

      // Salvamos APENAS a data na sua variável
      this.dataNascimento = dataFormatada;

      console.log('Data salva:', this.dataNascimento); // Deve mostrar "2025-10-16"
    }
  }
}