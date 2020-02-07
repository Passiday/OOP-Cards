class VEventTarget{
    events = [];
    constructor(name){
        this.name = name;
    }
    addEventListener(type,func){
        this.events.push({"type":type,"func":func})
    }
    dispatchEvent(e){
        for(let i =0;i < this.events.length;i++){
            if(this.events[i].type == e.type){
                this.events[i].func(e);
            }
        }
    }
    removeEventListener(type,func){
        let found = false;
        for(let i =0;i < this.events.length;i++){
            if(this.events[i].type == type && this.events[i].func == func){
                this.events.splice(i,1);
                found = true;
            }
        }
        if(!found){
            throw "Could not find event with the specified function and type: " + type + " " + func;
        }
    }

}
class VEvent{
    constructor(type,currenTarget,detail){
        this.type = type;
        this.currenTarget = currenTarget;
        this.detail = detail;
    }
}
