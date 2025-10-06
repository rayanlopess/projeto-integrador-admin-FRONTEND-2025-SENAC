import { Injectable } from '@angular/core';
import { RequiemDosDeusesService } from '../requisicao-HTTP/requisicao';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlteracaoSenhaService {

  constructor(
    public rs: RequiemDosDeusesService
  ) { }

  alterarSenha(recupCode: any, senha: string): Observable<any> {

    console.log(recupCode)
    return this.rs.post(`/user/alterar-senha`, {
      recupCode: recupCode,
      senhaNova: senha
    });
  }
}
