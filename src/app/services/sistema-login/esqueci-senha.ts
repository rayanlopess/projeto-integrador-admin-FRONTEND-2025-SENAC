import { Injectable } from '@angular/core';
import { RequiemDosDeusesService } from '../requisicao-HTTP/requisicao';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EsqueciSenhaService {

  constructor(
    public rs: RequiemDosDeusesService
  ) { }

  esqueciSenha(email: string): Observable<any> {
    // CORREÇÃO: Cria um objeto JSON com a chave "email" (ou o que o backend espera)
    const payload = {
      email: email 
    };
    
    // Envia o objeto 'payload'
    return this.rs.post('/user/enviar-recuperar-senha', payload);
  }
}
