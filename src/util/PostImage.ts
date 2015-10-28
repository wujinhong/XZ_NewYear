/**
 * Created by Gordon on 17/August/15.
 * @class PostImage
 * @constructor
 **/
class PostImage
{
    private urlLoader:egret.URLLoader;
    private urlRequest:egret.URLRequest;

    private onLoaded:Function;
    private onProcess:Function;
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
        //this.urlLoader.dataFormat = egret.URLLoaderDataFormat.VARIABLES;
        //this.urlLoader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;

        //this.urlLoader.dataFormat = egret.URLLoaderDataFormat.BINARY;
        this.urlLoader.dataFormat = egret.URLLoaderDataFormat.TEXT;

        this.urlLoader.addEventListener( egret.Event.COMPLETE, this.loaded, this );

        this.urlRequest = new egret.URLRequest( 'http://' + Global.IP + '/works/submit' );
        this.urlRequest.method = egret.URLRequestMethod.POST;
    }

    public send( param:any, loaded:Function = null, thisObj:any = null, onProcess:Function = null ):void
    {
        this.onLoaded = loaded;
        this.onProcess = onProcess;
        this.thisObj = thisObj;
        var urlVariables:egret.URLVariables = new egret.URLVariables( Global.objectToString( param ) );
        this.urlRequest.data = urlVariables;
        this.urlLoader.addEventListener( egret.Event.COMPLETE, this.loaded, this );

        if( null != onProcess )
        {
            this.urlLoader.addEventListener( egret.ProgressEvent.PROGRESS, onProcess, thisObj );
        }

        this.urlLoader.load( this.urlRequest );
    }

    private loaded( e:egret.Event ):void
    {
        this.urlLoader.removeEventListener( egret.Event.COMPLETE, this.loaded, this );
        if( null != this.onProcess )
        {
            this.urlLoader.removeEventListener( egret.ProgressEvent.PROGRESS, this.onProcess, this.thisObj );
        }

        if( this.urlLoader.data == null )
        {
            return;
        }
        var transData:any = JSON.parse( this.urlLoader.data );
        if( null != this.onLoaded )
        {
            this.onLoaded.apply( this.thisObj, [ transData ] );
        }
    }


    private static _instance:PostImage;

    public static get instance():PostImage
    {
        if( null == PostImage._instance )
        {
            PostImage._instance = new PostImage();
        }
        return PostImage._instance;
    }
}