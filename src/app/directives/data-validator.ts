import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  // O seletor é o nome que você usará no seu HTML, por exemplo: <input dataValidaEntre1900e2025>
  selector: '[dataValidaEntre1900e2025]',
  standalone: true, // Indica que é um componente/diretiva moderna e independente
  
  // O provider registra a diretiva no sistema de validação do Angular Forms
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: DataValidator,
    multi: true
  }]
})
export class DataValidator implements Validator {

  // Método obrigatório da interface Validator
  validate(control: AbstractControl): ValidationErrors | null {
    const dataString = control.value; // Recebe o valor 'DD/MM/AAAA'
    
    // 1. Checagem Básica e Formato
    if (!dataString || dataString.length !== 10) {
      return null; // Deixa o 'required' ou a máscara cuidar de campos vazios/incompletos
    }
    
    const partes = dataString.split('/');
    if (partes.length !== 3) {
      return { 'dataInvalida': { message: 'Formato inválido.' } };
    }
    
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const ano = parseInt(partes[2], 10);
    
    // 2. Lógica de Validação de Ano (1900 a 2025)
    const ANO_MINIMO = 1900;
    const ANO_MAXIMO = 2025;

    if (ano < ANO_MINIMO || ano > ANO_MAXIMO) {
      return { 'dataInvalida': { message: `Ano deve estar entre ${ANO_MINIMO} e ${ANO_MAXIMO}.` } };
    }
    
    // 3. Validação de Data Existente (ex: 30/Fev)
    // Nota: O mês no JS é 0-indexado (Janeiro = 0, Dezembro = 11)
    const dataObj = new Date(ano, mes - 1, dia); 
    
    if (dataObj.getFullYear() !== ano || dataObj.getMonth() !== mes - 1 || dataObj.getDate() !== dia) {
      return { 'dataInvalida': { message: 'Data inexistente ou inválida.' } };
    }
    
    // Se tudo estiver OK, a validação passou!
    return null;
  }
}