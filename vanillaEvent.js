class VEventTarget{
    events = {};
    addEventListener(type,func){
        if(type in this.events){
            if(this.events[type].includes(func)){
                throw new Error("Event listener with the specified type and function: " + type + " " + func + " already exists");
            }else{
                this.events[type].push(func);
            }
        }else{
            this.events[type] = [func];
        }
    }
    dispatchEvent(e){
        e.currentTarget = this;
        e.target = this;
        if(e.type in this.events){
            this.events[e.type].forEach(func => {
                func.call(this,e);
            });
        }
    }
    removeEventListener(type,func){
        if(type in this.events){
            let index = this.events[type].indexOf(func);
            if(index != -1){
                this.events[type].splice(index,1);
                return;
            }
        }
        throw new Error("Could not find event listener with the specified type and function: " + type + " " + func);
    }
}
class VEvent{
    constructor(type,customEventInit){
        this.type = type;
        this.detail = null;
        if(customEventInit !== undefined)
            this.detail = customEventInit.detail;
    }
}
