;
let eventChannel = (function(){
    // '_' mean origin thing
    const _defaultName = 'default';
    let Event = function(){
        const _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift;
        let namespaceCache = {};
        
        const _listen = function(key, fn, cache){
            if(!cache[key]) cache[key] = [];
            cache[key].push(fn);
        };
        let _trigger = function(){
            let self = this;
            let cache = _shift.call(arguments);
            let key = _shift.call(arguments);
            let args = arguments;
            let fnPool = cache[key];
            if(!fnPool || !fnPool.length) return;

            return fnPool.forEach(function (fn){
                fn.apply(self, args);
            })
        };
        const _removeListen = function(key, fn, cache){
            if(!cache[key]) return;
            if(fn){
                for(let i = cache[key].length;i >= 0; i--){
                    if(cache[key] === fn){ cache[key].splice(i, 1);}
                }
            }
            else{cache[key] = []};
        }

        const _channel = function(channelName){
            let namespace = channelName || _defaultName;
            let cache = {},
                offlineStack = [],
                ret = {
                    listen: function(key, fn, last){
                        _listen(key, fn, cache);
                        if(offlineStack === null) return;
                        if(last === 'last'){offlineStack.length && offlineStack.pop()();}
                        else{offlineStack.forEach(function(fn){
                            fn();
                        })}
                        offlineStack = null;
                    },
                    trigger: function(){
                        let fn, args, self = this;
                        _unshift.call(arguments, cache);
                        args = arguments;
                        fn = function(){
                            return _trigger.apply(self, args);
                        };
                        if(offlineStack)return offlineStack.push(fn);
                        return fn();
                    },
                    removeListen: function(key, fn){
                        _removeListen(key, cache, fn);
                    }
                }
            return namespace ? 
            (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret) : ret;
        }
        return {
            channel: _channel,
            listen: function(key, fn, last){
                let event = this.channel();
                event.listen(key, fn, last);
            },
            trigger: function(){
                let event = this.channel();
                event.trigger.apply(this, arguments);
            },
            removeListen: function(key, fn){
                let event = this.channel();
                event.removeListen(key, fn);
            }
        }
    }()
    return Event;
})();