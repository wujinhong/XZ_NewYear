/**
 * Created by Gordon on 17/August/15.
 * @class Global
 * @constructor
 **/
class Global
{
    //public static IP:string = '192.168.0.120';//测试环境
    public static HOST:string = 'sztc.gamexun.com';
    public static IP:string = 'api.' + Global.HOST;//正式环境

    /**
     * 将Object转化成 =& post字符串;
     * @param postData
     * @returns {string}
     */
    public static objectToString( postData ):string
    {
        var s = '';
        for( var key in postData )
        {
            var k_v = key + '=' + postData[key];
            s += k_v + '&';
        }
        s = s.substr( 0, s.length - 1 );
        return s;
    }

    public static isChineseName( name:string ):boolean
    {
        return /^[\u4e00-\u9fa5]+$/.test( name );
    }
    public static isPhoneNum( num:string ):boolean
    {
        num = num.toUpperCase();
        return /^0\d{2,3}-?\d{7,11}$|^1\d{10}$/.test( num );
    }
}