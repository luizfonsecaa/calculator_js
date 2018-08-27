class CalcController {

    constructor(){
        this._operation = [];
        this._pais = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl        = document.querySelector("#data");
        this._timeEl        = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    //metodo responsavel em apresentar hora e data acada 1 segundo
    initialize(){
        this.setDisplayDateTime();
        let interval = setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);
    }

    //metodo que executa multiplos eventos 
    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false);
        });
    } 

    //apaga todos os elemtos da minha operação
    clearAll(){
        this._operation = [];
    }

    //exclui o ultimo elemento da minhas operações
    clearEntry(){
        this._operation.pop();
    }

    //pego a ultima posição do array
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    //substituo o valor da ultima possisao do array
    setLastOperation(value){
        this._operation[this._operation.length -1] = value;
    }

    //verifico se ele e algum operador 
    isOperator(value){
        return (['+','-','*','%','/'].indexOf(value) > -1)
    }

    //adiciono o valor no array
    pushOperation(value){
        this._operation.push(value); 
        if(this._operation.length > 3){
            this.calc();
        }
    }

    // faz o calculo quando o array for igual a 3
    calc(){
        let last = this._operation.pop();
        let result = eval(this._operation.join(""));
        this._operation = [result, last];
    }
    //adiciona uma um elemento no array das minhas operações
    addOperation(value){
        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
                this.setLastOperation(value);
            }else if(isNaN(value)){
               
            }else{
                this.pushOperation(value);
            }
        }else{
            if(this.isOperator(value)){
                this.pushOperation(value);
            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));
                this.setLastNumberToDisplay();
            }
        }
        console.log('A',this._operation);
    }

    //metodo que dispara erro no display
    setError(){
        this.displayCalc = 'Error';
    }

    //metodo responsavel por verificar qual o tipo do botao quando for clicado
    execBtn(value){
        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
            break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
               
                break;
                
            case 'ponto':
                this.addOperation('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
                
        }

    }

    //metodo que lista todos os botoes e faz o each entre eles.
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, 'click drag', e =>{
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                btn.style.cursor = "pointer"
            });
        });
    }

    //metodo que passsa a hora e data para o display da calculadora 
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._pais, {
            day: "2-digit",
            month:"long", //short
            year:"numeric" //2-digit
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._pais);
    }

    //Data do dispolay
    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }

    //hora do display
    get displayTime(){
        return this._timeEl.innerHTML;
    }
    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }

    //valor do display
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    //data agora
    get currentDate(){
        return new Date();
    }
    set currentDate(value){
        this._currentDate = value;
    }
}