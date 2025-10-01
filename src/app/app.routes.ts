import { Routes } from '@angular/router';
import { PathsPage } from './pages/paths/paths.page';

export const routes: Routes = [

  //rotas principais
  {
    path: 'path',
    component: PathsPage,
    children: [
      {
        path: 'hospitais',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios.page').then( m => m.UsuariosPage)
      },
          {
        path: '',
        redirectTo: '/path/hospitais',
        pathMatch: 'full',
      }
    ],
  },



  //caminho vazio redireciona para home
  {
    path: '',
    redirectTo: 'tela-logo',
    pathMatch: 'full',
  },
  {
    path: 'config-user',
    loadComponent: () => import('./pages/subpages/config-user/config-user.page').then(m => m.ConfigUserPage)
  },
  {
    path: 'tela-logo',
    loadComponent: () => import('./pages/subpages/tela-logo/tela-logo.page').then(m => m.TelaLogoPage)
  },
  {
    path: 'config-inicial',
    loadComponent: () => import('./pages/subpages/config-inicial/config-inicial.page').then( m => m.ConfigInicialPage)
  },
  {
    path: 'central-ajuda',
    loadComponent: () => import('./pages/subpages/central-ajuda/central-ajuda.page').then( m => m.CentralAjudaPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./sistema-login/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'esqueci-senha',
    loadComponent: () => import('./sistema-login/esqueci-senha/esqueci-senha.page').then( m => m.EsqueciSenhaPage)
  },
  {
    path: 'alteracao-senha',
    loadComponent: () => import('./sistema-login/alteracao-senha/alteracao-senha.page').then( m => m.AlteracaoSenhaPage)
  },
  

 



];
