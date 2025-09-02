import { Injectable } from '@angular/core';
import { RequiemDosDeusesService } from '../requisicao-HTTP/requisicao';  
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
    
  constructor(public rs: RequiemDosDeusesService) { }

  logar(login: string, senha: string): Observable<any> {
    // Opção 1: Usando FormData (como você estava fazendo)
    const fd = new FormData();
    fd.append('login', login);
    fd.append('senha', senha);
    
    return this.rs.post('/auth/login', fd);

    // Opção 2: Usando JSON (mais comum para APIs REST)
    // const dados = { login, senha };
    // return this.rs.post('/auth/login', dados);
  }

  validarToken(token: string): Observable<any> {
  
  }

}
