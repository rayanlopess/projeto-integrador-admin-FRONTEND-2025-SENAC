import { Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Validar {
   public r:Renderer2;
  constructor(
    public renderer: RendererFactory2
  ) { 
    this.r = renderer.createRenderer(null, null);
  }

  isRequired(campos:any) : boolean{
    for(let c of campos){
      if(c.nativeElement.value == ''){
        this.r.addClass(c.nativeElement, "td-validation-error");
        return false;
      }
    }
    return true;
  }

  isValidCPF(strCPF: string): boolean {
    let retorno = false;
    strCPF = this.replaceAll(strCPF,".-", "");
    let Soma;
    let Resto;
    Soma = 0;
    
    if (strCPF == "00000000000") return false;
    if (strCPF == "11111111111") return false;
    if (strCPF == "22222222222") return false;
    if (strCPF == "33333333333") return false;
    if (strCPF == "44444444444") return false;
    if (strCPF == "55555555555") return false;
    if (strCPF == "66666666666") return false;
    if (strCPF == "77777777777") return false;
    if (strCPF == "88888888888") return false;
    if (strCPF == "99999999999") return false;

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    
    return true;
  }

  isValidTelefoneBR(telefone:string) : boolean{
    let valor = this.replaceAll(telefone, "()-", "");
    if(valor.length == 10 || valor.length == 11){
      return true;
    }else{
      return false;
    }
  }

  isValidFormatoData(data:string) : boolean{
    let valor = this.replaceAll(data,"/","");
    if(valor.length == 8){
      return true;
    }else{
      return false;
    }
  }

  isValidCNPJ(cnpj:string) : boolean{
    cnpj = cnpj.replace(/[^\d]+/g,'');

    if(cnpj == '') return false;

    if (cnpj.length != 14) return false;

    //elimina CPF invalidos conhecidos;
    if(cnpj == "00000000000000" ||
       cnpj == "11111111111111" ||
       cnpj == "22222222222222" ||
       cnpj == "33333333333333" ||
       cnpj == "44444444444444" ||
       cnpj == "55555555555555" ||
       cnpj == "66666666666666" ||
       cnpj == "77777777777777" ||
       cnpj == "88888888888888" ||
       cnpj == "99999999999999") return false;

    //valida DVs
    var tamanho:number = cnpj.length - 2;
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;
    for(let i = tamanho; i>=1; i--){
      soma += parseInt(numeros.charAt(tamanho - 1)) * pos--;
      if(soma < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if(resultado != parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for(let i = tamanho; i>= 1; i--){
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if(pos < 2){
        pos = 9;
      }
    }    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if(resultado != parseInt(digitos.charAt(1))) return false;

    return true;

  }

  isValidCEP(cep:string) : boolean{
    var valor = "";
    valor     = this.replaceAll(cep, "-", "");
    valor     = this.replaceAll(valor, ".","");

    var n     = valor.search(/[a-z]/ig);
    if(!n) return false;

    if(valor.length ==8){
      return true;
    }else{
      return false;
    }
  }

  isValidEmail(email:string) : boolean {
    let er = /^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2}/;
    if(!er){
      return false;
    }else{
      return true;
    }
  }

  isValidSenha(senha:string){
    if(senha.length < 8){
      return false;
    }else{
      let pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#-])(?:([0-9a-zA-Z@$!%*?&#-])(?!\1)){8,}$/i;
      let regex   = new RegExp(pattern, "g");
      return regex.test(senha);
    }
  }

  isNoEmpty(valor:any){
    if(valor == null || valor == undefined || valor == ''){
      return false;
    }else{
      return true;
    }
  }

  replaceAll(str:string, de:string, para:string) : string{
    var retorno = str;
    for(let i=0;de.length;i++){
      retorno = retirar(retorno, de.substring(i, 1), para);
    }
    return retorno;
    function retirar(str:string, de:string, para:string){
      if(str != '' && str != null && str != undefined){
        var pos = str.indexOf(de);
        while(pos > -1){
          str = str.replace(de, para);
          pos = str.indexOf(de)
        }
      }else{
        str = '';
      }
      return (str);
    }
  }
}
