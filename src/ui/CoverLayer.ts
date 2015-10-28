/**
 * Created by Gordon on 14/August/15.
 * @class CoverLayer
 * @constructor
 **/
class CoverLayer
{
    private cover:egret.Shape;

    public constructor()
    {
        this.cover = new egret.Shape();
        this.cover.touchEnabled = true;
        var g:egret.Graphics = this.cover.graphics;
        g.beginFill( 0, 0 );
        g.drawRect( 0, 0, Layer.WIDTH, Layer.HEIGHT );
        g.endFill();
        this.cover.width = Layer.WIDTH;
        this.cover.height = Layer.HEIGHT;
    }

    public addCover():void
    {
        if( null != this.cover.parent )
        {
            return;
        }
        Layer.LOADING.addChild( this.cover );
    }

    public removeCover():void
    {
        if( null != this.cover.parent )
        {
            Layer.LOADING.removeChild( this.cover );
        }
    }

    private static _instance:CoverLayer;

    public static get instance():CoverLayer
    {
        if( CoverLayer._instance )
        {
            return CoverLayer._instance;
        }
        else
        {
            CoverLayer._instance = new CoverLayer();
        }
        return CoverLayer._instance;
    }
}