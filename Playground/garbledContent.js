;(function(){
    let doms = [...document.querySelectorAll('.slot-texts .info .number')];
    const duration = 1200;
    const secondPerMillisecond = 66;
    let times = Math.fround(duration / secondPerMillisecond);
    let contents = [];
    let textDom = document.querySelector('.slot-texts');
    function initial(){
        for (let index = 0; index < doms.length; index++) {
            let string = doms[index].innerHTML;
            let reg = /[0-9]\w+/g;
            contents[index] = [reg.exec(string)[0], string.replace(reg,'')];
        }
    }
    initial();
    function interpolate(from=0, to=0, basis=0){
        let isFloat = from % 1 !== 0 || to % 1 !== 0;
        let modRatio = 1;
        if(isFloat){
            const fromSlicePoint = String(from).indexOf('.') > 0 ? String(from).indexOf('.') : 0;
            let fromDecimalPlace = String(from).slice(fromSlicePoint).length ;
            const toSlicePoint = String(to).indexOf('.') > 0 ? String(to).indexOf('.') : 0;
            let toDecimalPlace = String(to).slice(toSlicePoint).length;
            modRatio = Math.pow(10,Math.max(fromDecimalPlace, toDecimalPlace));
        }
        return ((to * modRatio - from * modRatio) * basis + from * modRatio) / modRatio; 
    }
    let effectSwitch = true;
    let isAnimating = false;
    function garbledPerFrame(){
        window.requestAnimationFrame(()=>{
            if(times > 0){
                for (let index = 0; index < doms.length; index++) {
                    const ratio = times / Math.fround(duration / secondPerMillisecond);
                    const stringLength = Math.round(interpolate(0, contents[index][0].length, ratio));
                    let endPos = stringLength != 0 ? contents[index][0].length - stringLength : contents[index][0].length - 1;
                    let unGarbled = contents[index][0].slice(0, endPos);
                    doms[index].innerHTML = unGarbled + Math.floor(Math.random() * Math.pow(10, stringLength)) + contents[index][1];
                }
                times--;
                isAnimating = true;
                setTimeout(garbledPerFrame, secondPerMillisecond);
            }
            else{
                times = Math.fround(duration / secondPerMillisecond);
                for (let index = 0; index < doms.length; index++) {
                    doms[index].innerHTML = contents[index][0] + contents[index][1];
                }
                effectSwitch = false;
                isAnimating = false;
                console.log('animation done');
            }
        })
    }
    function animationGarbled(){
        if(effectSwitch && !isAnimating){
            effectSwitch = false;

            garbledPerFrame();
        }
        else{
            effectSwitch = true;
        }
    }
    let scrollDetect = new IntersectionObserver(animationGarbled, {
        rootMargin: '0px',
        threshold:0.5
    })
    scrollDetect.observe(textDom);
})()