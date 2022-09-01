;(function(){
    let dom = document.querySelector('.step-text');
    function varToStyle(entrys){
        window.requestAnimationFrame(()=>{
            let styleVar = `--scroll-ratio: ${Math.round(entrys[0].intersectionRatio * 1000) / 1000};`;
            dom.setAttribute('style',styleVar);
        })
    }
    let scrollDetect = new IntersectionObserver(varToStyle, {
        rootMargin:'99999px 0px 0px 0px',
        threshold:function (){
            let ary = [];
            let frequent = 1000;
            for (let index = 0; index < frequent; index++) {
                ary[index] = index / frequent;
            }
            return ary;
        }()
    })
    scrollDetect.observe(dom.parentElement);
})()