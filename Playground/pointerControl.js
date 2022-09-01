;(function (){
    let dom = document.querySelector('body');
    console.log(navigator.userAgentData);
    
    function pointerPosToStyle(evt){
        window.requestAnimationFrame(()=>{
            const styleVar = `--pointer-x:${evt.x}px;
            --pointer-y:${evt.y}px;
            --pointer-ratioX:${evt.x / window.visualViewport.width};
            --pointer-ratioY:${evt.y / window.visualViewport.height};`;
            dom.setAttribute('style',styleVar);

            let isHover = false;
            for (const iterator of evt.path) {
                let classname = iterator?.className || '';
                if(classname.indexOf('button') != -1 || iterator.localName == 'button'){
                    isHover = true
                };
            }
            if(isHover && !dom.className.includes('is-hover')){
                dom.classList.add('is-hover');
            }
            else if(!isHover && dom.className.includes('is-hover')){
                dom.classList.remove('is-hover');
            }
        })
    }
    window.addEventListener('pointermove',pointerPosToStyle);

    function mobileDeviceDetect(){
        if(navigator.userAgentData.mobile){
            window.removeEventListener('pointermove',pointerPosToStyle);
            dom.classList.add('phone-device');
        }else{
            dom.classList.remove('phone-device');
        }
    }
    mobileDeviceDetect();
    window.addEventListener('resize',mobileDeviceDetect);
})();