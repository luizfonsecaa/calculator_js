class CalcController {

    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._pais = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl        = document.querySelector("#data");
        this._timeEl        = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initkeyboard();
        this.pasteFromClipboard();
        window.focus();
        console.log(this._audioOnOff);
    }

    //copiando o display
    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy');
        input.remove();

    }
    //colando no display
    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
            console.log(text);
        });
    }

    //metodo responsavel em apresentar hora e data acada 1 segundo
    initialize(){
        this.setDisplayDateTime();
        let interval = setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);
        this.setLastNumberToDisplay();
        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();

            });
        });
    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
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
        this.setLastNumberToDisplay();
        this._lastNumber = "";
        this.lastOperation = "";
    }

    //exclui o ultimo elemento da minhas operações
    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
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
    getResult(){
        try{
            return eval(this._operation.join(""));
        }catch(e){
          setTimeout(()=>{
            console.log(e);
            this.setError();
          }, 1);
        }
    }

    // faz o calculo quando o array for igual a 3
    calc(){
        let last = '';
        this._lastOperator = this.getLastItem();
        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){
            last = this._operation.pop();
            this._lastNumber   = this.getResult();
        }else if(this._operation.length == 3){
            this._lastNumber   = this.getLastItem(false);
        }
        let result = this.getResult();
        if(last == "%"){
            //igual a ele mesmo dividido por 100
            result /= 100;
            this._operation = [result];
        }else{
            this._operation = [result];
            if(last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    }
    initkeyboard(){
        document.addEventListener('keyup', e=>{
            this.playAudio();
            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
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
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });
    }
    //trago o ultimo operador setado (true para operador e false para numero)
    getLastItem(isOperator = true){
        let lastItem;
        for (let i = this._operation.length-1; i >= 0; i--){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }
        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this.lastNumber;
        }
        return lastItem;
    }

    //apresenta no display o ultimo valor caso nao tenha aficiona o zero
    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        if(!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }

    //adiciona uma um elemento no array das minhas operações
    addOperation(value){
        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
                this.setLastOperation(value);
            }else{
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        }else{
            if(this.isOperator(value)){
                this.pushOperation(value);
            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
        }

    }

    //metodo que dispara erro no display
    setError(){
        this.displayCalc = 'Error';
    }
    addDot() {
        let lastOperation = this.getLastOperation();
        if (typeof lastOperation === "string" && lastOperation && lastOperation.split('').indexOf('.') > -1) return;
        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
        console.log(lastOperation);
    }
    //metodo responsavel por verificar qual o tipo do botao quando for clicado
    execBtn(value){
        this.playAudio();
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
                this.calc();
                break;

            case 'ponto':
                this.addDot();
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
        if(value.toString().length > 10){
            this.setError();
            return;
        }
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