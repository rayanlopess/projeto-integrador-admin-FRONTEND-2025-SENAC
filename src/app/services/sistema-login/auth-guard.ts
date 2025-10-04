import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { AutenticacaoService } from '../sistema-login/autenticacao';
import { lastValueFrom } from 'rxjs'; // Importe para converter o Observable em Promise

// Altere para uma função assíncrona
export const authGuard: CanActivateFn = async (route, state) => { 
  
  const autenticacaoService = inject(AutenticacaoService);
  const router = inject(Router);
  const token = localStorage.getItem('token');


  if(!token){

    limparLocalStorage(); 
    router.navigate(['/login']);
    return false;
  }

  try {
   
    const res = await lastValueFrom(autenticacaoService.validarToken(token));

    if (res.message == "Token válido") {
      
      return true;
    } else {
      
      console.log('Token inválido. Status retornado: ', res.message);
      limparLocalStorage();
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    // Erro na requisição (ex: falha de rede, servidor fora do ar, erro HTTP 401/403)
    // O erro geralmente significa token inválido ou problema de comunicação.
    console.error('Erro durante a validação do token: ', error);
    limparLocalStorage();
    router.navigate(['/login']);
    return false;
  }
};

/**
 * Função auxiliar para limpar o SessionStorage.
 */
function limparLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('is_master_admin');
}