/**
 * Created by Gordon on 14/August/15.
 * @class Tip
 * @constructor
 **/
class Tip extends egret.DisplayObjectContainer
{
    private static _instance:Tip;
    private text:egret.TextField;

    public constructor()
    {
        super();
        this.init();
    }

    public static get instance():Tip
    {
        if( null == Tip._instance )
        {
            Tip._instance = new Tip();
        }
        return Tip._instance;
    }

    /**
     * 初始化
     **/
    private init():void
    {
        this.y = 300;
        var shape:egret.Shape = new egret.Shape();
        var g:egret.Graphics = shape.graphics;
        g.beginFill( 0x000000, 0.7 );
        g.drawRect( 0, 0, 480, 60 );
        g.endFill();
        this.addChild( shape );

        this.text = new egret.TextField();
        this.text.textAlign = egret.HorizontalAlign.CENTER;

        this.addChild( this.text );
    }

    private timeOutId:number;

    public showTip( tip:string ):void
    {
        if( null == this.parent )
        {
            Layer.TIP.addChild( this );
        }
        this.text.text = tip;
        this.text.x = ( 480 - this.text.width ) / 2;
        this.text.y = ( 60 - this.text.height ) / 2;

        egret.clearTimeout( this.timeOutId );
        this.timeOutId = egret.setTimeout( this.onTimeout, this, 1200 );
    }

    private onTimeout():void
    {
        this.hide();
    }
    public hide():void
    {
        if( null == this.parent )
        {
            return;
        }
        Layer.TIP.removeChild( this );
    }
}