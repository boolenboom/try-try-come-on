;
//*params fetcher is an Object
//*return an Object with basic fetch processor & setter
function fetcherGenerator( fetcher = {} ){
    if( typeof fetcher !== 'object' )fetcher = {};
    fetcher.url = '';
    fetcher.header = '';
    fetcher._shift = Array.prototype.shift;
    fetcher._dataFn = function( originData ){
        return originData;
    };

    fetcher.getAPIData = function(){
        let afterAction = this._shift.call( arguments );
        let args = arguments;
        let fn = this._dataFn;

        fetch( this.url, this.header )
        .then( res => res.json() )
        .then( data => {
            console.log(data);
            let formatData = fn( data );
            afterAction( ...args, formatData );
        })
        .catch( errMsg => console.log(errMsg) );
    };
    fetcher.setHeader = function(
        AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF', 
        AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'){
        let GMTString = new Date().toGMTString();
        let ShaObj = new jsSHA( 'SHA-1', 'TEXT' );
        ShaObj.setHMACKey( AppKey, 'TEXT' );
        ShaObj.update( 'x-date: ' + GMTString );
        let HMAC = ShaObj.getHMAC( 'B64' );
        let Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"';
        fetcher.header = { 'Authorization' : Authorization, 'X-Date' : GMTString }; 
    };
    fetcher.setUrl = function( fn ){
        fetcher.url = fn(...arguments);
    };
    fetcher.setDataMiddleHandler = function( fn ){
        fetcher._dataFn = fn;
    };

    return fetcher;
}
//API factory product
let factoryStrategies = {
    PTXData:function( originObj, [THEME, CATEGORY, BASEURL] ){
        //mount object
        let mountObj = originObj;
        //Url type
        let theme=THEME || 'Tourism' ,category=CATEGORY || 'Activity' ,otherParameters='';
        //Query
        let $top = 50,$skip = 0;
        let $select='',$filter = '',$orderby='',$spatialFilter = '';
        let $format = 'JSON';

        let base= BASEURL || 'https://ptx.transportdata.tw/MOTC/v2/';
        //Auth key
        let AppID = 'eb78cef36689451a8aab0db192c90462';
        let AppKey = 'BcSgzENVt1N5FxsK0SOjFiAU3eA';
        //initial setting
        mountObj.setUrl( paramsCombineToUrl );
        mountObj.setHeader( AppID, AppKey );
        mountObj.setDataMiddleHandler( APIDataFormatToFrontEndData );

        //custom methods
        function ParamsCombineToQuery( setting ){
            let combination = '';
            for (const key in setting) {
                combination += setting[key] ? key + '=' + setting[key] + '&' : '';
            }
            return combination;
        }
        function paramsCombineToUrl(){
            let OP = otherParameters ? '/' + otherParameters : '';
            let combination = base + theme + '/' + category + OP + 
                '?' + ParamsCombineToQuery( {$top, $skip, $select, $filter, $orderby, $spatialFilter, $format} );
            return combination;
        }
        function APIDataFormatToFrontEndData( originData ){
            function truthyPushArray( dataArr ){
                let truthyArr = [];
                dataArr.forEach(el=>{
                    if(el!==undefined)truthyArr.push(el);
                });
                return truthyArr;
            }
            let mapObj = originData.map(item=>{
                return {
                    ID: item?.ActivityID || item?.RestaurantID || item?.ScenicSpotID,
                    Name: item?.ActivityName || item?.RestaurantName || item?.ScenicSpotName || '',
                    Address: item?.Address || item?.City,
                    Description: item?.Description || '',
                    Organizer: item?.Organizer || '',
                    Phone: String( item.Phone ).split( '、' )[0] || '',
                    OpenTime: item?.OpenTime || String( item.StartTime ).split('T')[0] + '~' + String( item.EndTime ).split('T')[0],
                    ClassTags: truthyPushArray( [item?.Class1,item?.Class2,item?.Class3] ),
                    PictureUrl: truthyPushArray( [item.Picture?.PictureUrl1, item.Picture?.PictureUrl2, item.Picture?.PictureUrl3] ) || '',
                    PictureDescri: truthyPushArray( [item.Picture?.PictureDescription1, item.Picture?.PictureDescription2, item.Picture?.PictureDescription3] ) || ''
                }
            })
            return mapObj;
        }

        //mount to API
        mountObj._dataFn = APIDataFormatToFrontEndData;
        mountObj.getCategory = function(){
            return category;
        }
        mountObj.setUrlType = function( {THEME, CATEGORY} = setting ){
            theme = THEME || theme;
            category = CATEGORY || category;
            mountObj.setUrl( paramsCombineToUrl );
        }
        mountObj.setQuery = function( {top, skip, select, format, filter} = setting ){
            $top = top || $top;
            $skip = skip || $skip;
            $select = select || $select;
            $format = format || $format;
            $filter = filter || $filter;
            mountObj.setUrl( paramsCombineToUrl );
        }

        return mountObj;
    }
}
//*params apiName is a string to assign product
//*return an Object with custom processor & setter
let APIFactory = function(){
    let apiName = Array.prototype.shift.call(arguments),
        args = arguments,
        basicFetcher = new fetcherGenerator();
    let customFetcher = factoryStrategies[apiName]( basicFetcher, args );
    return Object.create( customFetcher );
}