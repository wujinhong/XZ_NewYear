/**
 * Created by Gordon on 10/January/15.
 * 平台id
 */
class Platform
{
    /**
     * -1 未判断过； 0 不是微信平台打开的； 1 是微信平台打开的
     * @type {number}
     */
    private static weixinStatus:number = -1;
    public static get isWeiXin():boolean
    {
        if( 1 == Platform.weixinStatus )
        {
            return true;
        }
        if( 0 == Platform.weixinStatus )
        {
            return false;
        }
        if( null == window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i ) )
        {
            Platform.weixinStatus = 0;
            return false;
        }
        Platform.weixinStatus = 1;
        return true;
    }
}