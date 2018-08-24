class CalcController {

    constructor(){
        this._pais = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl        = document.querySelector("#data");
        this._timeEl        = document.querySelector("#hora");
        // this._currentDate;
        this.initialize();
    }

    initialize(){
        setInterval(()=>{
            this.displayDate = this.currentDate.toLocaleDateString(this._pais);
            this.displayTime = this.currentDate.toLocaleTimeString(this._pais);
        }, 1000);

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


    // get currentDate(){
    //     return this._currentDate;
    // }
    // set currentDate(value){
    //     this._currentDate = value;
    // }

}