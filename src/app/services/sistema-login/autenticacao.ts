import { Injectable } from '@angular/core';
import { RequiemDosDeusesService } from '../requisicao-HTTP/requisicao';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  constructor(public rs: RequiemDosDeusesService) { }

  logar(login: string, senha: string) {

    const dadosDeLogin = { login, senha };
    console.log(dadosDeLogin)
    return this.rs.post('/auth/login', dadosDeLogin);

  }

  validarToken(token: string): Observable<any> {
    

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      });

      return this.rs.post('/auth/validar-token', {}, { headers: headers }); 
  }

  logOut(token: string): Observable<any>{
   
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      });

 
      return this.rs.post('/auth/logout', {}, { headers: headers }); 

      
  }

}


