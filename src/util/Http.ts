/**
 * Created by Gordon on 17/August/15.
 * @class Http
 * @constructor
 **/
class Http
{
    private urlLoader:egret.URLLoader;
    private urlRequest:egret.URLRequest;

    private onLoaded:Function;
    private thisObj:any;

    public constructor()
    {
        this.init();
    }

    /**
     * 初始化
     **/
    private init():void
    {
        this.urlLoader = new egret.URLLoader();
        this.urlLoader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        this.urlLoader.addEventListener( egret.Event.COMPLETE, this.loaded, this );

        this.urlRequest = new egret.URLRequest( 'http://' + Global.IP + '/works/list' );
        this.urlRequest.method = egret.URLRequestMethod.POST;
    }

    public getList( param:any, loaded:Function = null, thisObj:any = null ):void
    {
        this.urlRequest.url = 'http://' + Global.IP + '/works/list';
        this.send( param, loaded, thisObj );
    }
    public query( param:any, loaded:Function = null, thisObj:any = null ):void
    {
        this.urlRequest.url = 'http://' + Global.IP + '/works/query';
        this.send( param, loaded, thisObj );
    }
    public vote( param:any, loaded:Function = null, thisObj:any = null ):void
    {
        this.urlRequest.url = 'http://' + Global.IP + '/vote/submit';
        this.send( param, loaded, thisObj );
    }
    private send( param:any, loaded:Function = null, thisObj:any = null ):void
    {
        this.onLoaded = loaded;
        this.thisObj = thisObj;
        var urlVariables:egret.URLVariables = new egret.URLVariables( Global.objectToString( param ) );
        this.urlRequest.data = urlVariables;
        this.urlLoader.addEventListener( egret.Event.COMPLETE, this.loaded, this );

        LoadingLayer.instance.addCover();
        this.urlLoader.load( this.urlRequest );
    }

    private loaded( e:egret.Event ):void
    {
        this.urlLoader.removeEventListener( egret.Event.COMPLETE, this.loaded, this );

        var data:any = JSON.parse( this.urlLoader.data );
        if( null != this.onLoaded )
        {
            this.onLoaded.apply( this.thisObj, [ data ] );
        }
        LoadingLayer.instance.removeCover();
    }


    private static _instance:Http;

    public static get instance():Http
    {
        if( null == Http._instance )
        {
            Http._instance = new Http();
        }
        return Http._instance;
    }
}