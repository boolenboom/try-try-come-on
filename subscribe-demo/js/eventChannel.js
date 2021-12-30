;
let eventChannel = {
    clientList: {},
    listen: function(key, fn){
        if(!this.clientList[key]) this.clientList[key] = [];
        this.clientList[key].push(fn);
    },
    trigger: function(){
        let key = Array.prototype.shift.call(arguments);
        console.log(this);
        let fnPool = this.clientList[key];
        let foo;
        console.log(foo = fnPool[0]);
        for(let i=0, fn; fn=fnPool[i++];){
            fn.apply(this, arguments);//arguments裡面的key已被抽走
        }
    },
    removeListen: function(key, removeFn){
        let fnPool = this.clientList[key];
        if(fnPool.length === 0 || !fnPool) return false;
        if(!removeFn){ fnPool && (fnPool.length = 0)}//removeFn為falsy後，且fnPool為truthy，才把fnPool清空
        else{
            for(let i=0, fn;fn = fnPool[i]; i++){
                if(fn === removeFn){
                    fnPool.splice(i, 1);
                }
            }
        }
    }
}

let installEvent = function (obj){
    for(let item in eventChannel){
        obj[item] = eventChannel[item];
    }
}