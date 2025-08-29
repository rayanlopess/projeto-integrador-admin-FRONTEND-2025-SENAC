import { Routes } from '@angular/router';
import { PathsPage } from './pages/paths/paths.page';

export const routes: Routes = [

   //rotas principais
   {
    path: 'path',
    component: PathsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'mapa',
        loadComponent: () => import('./pages/mapa/mapa.page').then(m => m.MapaPage)
      },
      {
        path: 'telefones',
        loadComponent: () => import('./pages/telefones/telefones.page').then(m => m.TelefonesPage)
      },
      {
        path: 'configuracoes',
        loadComponent: () => import('./pages/configuracoes/configuracoes.page').then(m => m.ConfiguracoesPage)
      },
      {
        path: '',
        redirectTo: '/path/home',
        pathMatch: 'full',
      }
    ],
  },

  //sistema de login
  {
    path: 'login',
    loadComponent: () => import('./sistema-login/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./sistema-login/cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  {
    path: 'esqueci-senha',
    loadComponent: () => import('./sistema-login/esqueci-senha/esqueci-senha.page').then( m => m.EsqueciSenhaPage)
  },
  {
    path: 'validacao-email',
    loadComponent: () => import('./sistema-login/validacao-email/validacao-email.page').then( m => m.ValidacaoEmailPage)
  },
  {
    path: 'alteracao-senha',
    loadComponent: () => import('./sistema-login/alteracao-senha/alteracao-senha.page').then( m => m.AlteracaoSenhaPage)
  },


  //caminho vazio redireciona para home
  {
    path: '',
    redirectTo: 'path/home',
    pathMatch: 'full',
  },  {
    path: 'swipper',
    loadComponent: () => import('./pages/subpages/swipper/swipper.page').then( m => m.SwipperPage)
  },
  {
    path: 'privacidade-seguranca',
    loadComponent: () => import('./pages/subpages/termos-privacidade/privacidade-seguranca/privacidade-seguranca.page').then( m => m.PrivacidadeSegurancaPage)
  },
  {
    path: 'termos-uso',
    loadComponent: () => import('./pages/subpages/termos-privacidade/termos-uso/termos-uso.page').then( m => m.TermosUsoPage)
  },
  {
    path: 'config-user',
    loadComponent: () => import('./pages/subpages/config-user/config-user.page').then( m => m.ConfigUserPage)
  },
  {
    path: 'tela-logo',
    loadComponent: () => import('./pages/subpages/tela-logo/tela-logo.page').then( m => m.TelaLogoPage)
  }

  
];
