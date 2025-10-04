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


  constructor(
    private router: Router,
    private dateService: DateService,
    public alertController: AlertController,
    private popoverCtrl: PopoverController,
    private loadingController: LoadingController,
    // Injetando o novo serviço
    @Inject(UserService) private userService: UserService,
    private cd: ChangeDetectorRef

  ) {
    addIcons({ home, map, call, settings, personCircle, invertMode, medicalOutline, warningOutline, car, navigate, time, people, location, create, chevronUp, add, trash, lockClosed, lockOpen, closeCircle, document, ellipsisVertical });
  }

  ngOnInit() {
    window.addEventListener('storage', this.storageChangeListener);
    this.loadUsers();
  }
  ngOnDestroy() {
    window.removeEventListener('storage', this.storageChangeListener);
  }


  async loadUsers() {
    if (this.carregando) return;

    const loading = await this.loadingController.create({
      message: 'Carregando usuários...',
      spinner: 'circles',
    });
    await loading.present();

    this.carregando = true;
    this.erroCarregamento = false;

    try {
      this.users = await this.userService.getAllUsers(this.token);
      console.log(this.users)
      this.erroCarregamento = false;
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      this.erroCarregamento = true;
      this.users = []; // Limpa a lista em caso de erro
      this.presentAlert('Erro', 'Não foi possível carregar a lista de usuários. Tente novamente mais tarde.');
    } finally {
      this.carregando = false;
      loading.dismiss();
    }
  }

  // --- Lógica de Modos (Edição/Deleção) ---

  /**
   * Alterna entre os modos de edição e deleção.
   * @param mode 'edit' para modo de edição, 'delete' para modo de deleção.
   */
  toggleMode(mode: 'edit' | 'delete') {
    // Impedir que os modos se sobreponham
    if (mode === 'edit') {
      this.isDeletingMode = false;
      this.isEditingMode = !this.isEditingMode;
    } else if (mode === 'delete') {
      this.isEditingMode = false;
      this.isDeletingMode = !this.isDeletingMode;
    }
  }
  exitMode() {
    this.isEditingMode = false;
    this.isDeletingMode = false;
  }

  // --- Lógica dos Modais (Add/Edit) ---

  /**
   * Abre e fecha o modal de cadastro de usuário.
   */
  setOpenAdd(isOpen: boolean) {
    this.isModalOpenAdd = isOpen;
    if (isOpen) {
      this.clearForm();
    }
  }

  /**
   * Abre e fecha o modal de edição de usuário.
   * Preenche o formulário se um usuário for fornecido.
   * @param isOpen Se o modal deve estar aberto.
   * @param user O usuário a ser editado (opcional).
   */
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

  /**
   * Preenche as variáveis do formulário com os dados do usuário selecionado.
   */
  fillForm(user: User) {
    this.nomeCompleto = user.nome;
    this.dataNascimento = user.nascimento;
    this.cpf = user.cpf;
    this.email = user.email;
    this.nomeUsuario = user.usuario;
    this.senha = '';
  }

  /**
   * Limpa as variáveis do formulário.
   */
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
    const loading = await this.loadingController.create({
      message: 'Salvando usuário...',
      spinner: 'lines',
    });
    await loading.present();

    try {
      const userData: Omit<User, 'id'> = {
        email: this.email,
        usuario: this.nomeUsuario,
        senha: this.senha,
        nome: this.nomeCompleto,
        cpf: this.cpf,
        nascimento: this.dataNascimento
      };

      if (this.selectedUser) {
        // Modo Edição
        await this.userService.updateUser({ ...userData, id: this.selectedUser.id });
        this.setOpenEdit(false);
        this.presentAlert('Sucesso!', 'Usuário atualizado com sucesso!');
      } else {
        // Modo Cadastro
        await this.userService.createUser(userData, this.token);
        this.setOpenAdd(false);
        this.presentAlert('Sucesso!', 'Usuário cadastrado com sucesso!');
      }

      // Recarrega a lista após a operação
      await this.loadUsers();

    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      this.presentAlert('Erro', 'Não foi possível salvar o usuário. Verifique os dados e tente novamente.');
    } finally {
      loading.dismiss();
    }
  }

  /**
   * Deleta um usuário após confirmação.
   * @param user O usuário a ser deletado.
   */
  async deleteUser(user: User) {
    // NÃO VAMOS SAIR do modo de deleção aqui: this.isDeletingMode = false;

    const alert = await this.alertController.create({
      // ... (restante do alert mantido)
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Deletar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Deletando usuário...',
              spinner: 'dots',
            });
            await loading.present();

            try {
              await this.userService.deleteUser(user.id);
              await this.loadUsers();
              this.presentAlert('Sucesso!', 'Usuário deletado com sucesso!');
              // O modo continua ativo, permitindo deletar mais.
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

  /**
   * Navega ou exibe detalhes do usuário (ação padrão do card).
   * @param user O usuário clicado.
   */
  viewUserDetails(user: User) {
    if (this.isEditingMode || this.isDeletingMode) {
      // Se estiver em modo de edição/deleção, a ação é pelo botão de canto.
      return;
    }
    // Implementar aqui a lógica de visualização de detalhes
    this.presentAlert('Detalhes do Usuário', `Nome Completo: ${user.nome}\nNome de Usuário: ${user.usuario}`);
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
      buttons: ['OK'],
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