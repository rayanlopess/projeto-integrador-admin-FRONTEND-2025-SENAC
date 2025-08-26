import { Routes } from '@angular/router';
import { PathsPage } from './pages/paths/paths.page';

export const routes: Routes = [

  //caminho vazio redireciona para home
  {
    path: '',
    redirectTo: 'path/home',
    pathMatch: 'full',
  },

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
        path: 'page1',
        loadComponent: () => import('./pages/swipper/page1/page1.page').then( m => m.Page1Page)
      },
      {
        path: 'page2',
        loadComponent: () => import('./pages/swipper/page2/page2.page').then( m => m.Page2Page)
      },
      {
        path: 'page3',
        loadComponent: () => import('./pages/swipper/page3/page3.page').then( m => m.Page3Page)
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




  
];
