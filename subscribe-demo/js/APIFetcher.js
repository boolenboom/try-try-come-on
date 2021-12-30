;
function getAuthorizationHeader() {
    //  填入自己 ID、KEY 開始
    // let AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    // let AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    let AppID = 'eb78cef36689451a8aab0db192c90462';
    let AppKey = 'BcSgzENVt1N5FxsK0SOjFiAU3eA';
    //  填入自己 ID、KEY 結束
    let GMTString = new Date().toGMTString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"';
    return { 'Authorization': Authorization, 'X-Date': GMTString }; 
}
let fetcher = function(THEME,CATEGORY,BASEURL){
    let theme=THEME || 'Tourism' ,category=CATEGORY || 'Activity' ,otherParameters='';
    let $top = 10,$skip = 0;
    let $select='',$filter = '',$orderby='',$spatialFilter = '';
    let $format = 'JSON';
    let query='$top=30';
    let base= BASEURL || 'https://ptx.transportdata.tw/MOTC/v2/';
    let url=`${base}${theme}/${category}${otherParameters?'/' + otherParameters:''}?${query}`;
    // let isLoaded=false;
    function queryParamCombine(setting){
        // console.group('query');
        // console.log(setting);
        let keys = Object.keys(setting);
        let value = Object.values(setting);
        let combination = value.reduce((acc,curr,index)=>{
            return acc + (curr ? keys[index] + '=' + curr + '&' : '');
        },'')
        // console.log('query:' + combination);
        // console.groupEnd('query');
        query = combination;
    };
    function urlUpdate(){
        url=`${base}${theme}/${category}${otherParameters?'/' + otherParameters:''}?${query}`;
        // console.group('fetchUrl');
        // console.log(url);
        // console.groupEnd('fetchUrl');
    };
    return {
        getHeader:function(){
            return {headers: getAuthorizationHeader(),method:'GET'};
        },
        getUrl:function(){
            queryParamCombine({$top,$skip,$select,$filter,$orderby,$spatialFilter,$format});
            urlUpdate();
            return url;
        },
        getCategory:function(){
            return category;
        },
        setQuery:function(setting){
            $top=setting.top || $top;
            $skip=setting.skip || $skip;
            $select=setting.select || $select;
            $format=setting.format || $format;
            $filter=setting.filter || $filter;
        },
        setSearch:function(searchString){
            if(!searchString) return;
            $filter=`contain(Name,${searchString})`;
        },
        setOtherParam:function(otherParam){
            otherParameters = otherParam || otherParameters;
        },
        scopeSearch:function(lat,lon,raduis){
            if(!lat || !lon || !raduis)return;
            $spatialFilter=`nearby(${lat},${lon},${raduis})`;
        },
        getData:function(triggerFn,triggerKey,triggerMsg){
            fetch(this.getUrl(),this.getHeader())
            .then(res=>res.json())
            .then(function(data){
                console.log(data);
                triggerFn(triggerKey, data, triggerMsg);
            }).catch(function(errMsg){console.log(errMsg);})
        }
    }
}