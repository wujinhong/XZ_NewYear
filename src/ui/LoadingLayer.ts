/**
 * Created by Gordon on 14/August/15.
 * @class LoadingLayer
 * @constructor
 **/
class LoadingLayer
{
    private wait:egret.Bitmap;
    private stiv:any;

    public constructor()
    {
        this.wait = new egret.Bitmap();
        this.wait.texture = RES.getRes( 'loading' );
        this.wait.anchorX = this.wait.anchorY = .5;
        this.wait.x = Layer.WIDTH * .5;
        this.wait.y = Layer.HEIGHT * .5;

        Layer.LOADING.addChild( this.wait );
        this.wait.visible = false;
        this.stiv = null;
    }

    public addCover():void
    {
        if( this.wait.visible )
        {
            return;
        }

        this.wait.visible = true;
        CoverLayer.instance.addCover();

        if( this.stiv )
        {
            egret.clearInterval( this.stiv );
            this.stiv = null;
        }

        this.stiv = egret.setInterval( ()=>
        {
            this.wait.rotation += 5;
        }, this, 10 );
    }

    public removeCover():void
    {
        if( !this.wait.visible )
        {
            return;
        }
        if( this.stiv )
        {
            egret.clearInterval( this.stiv );
            this.stiv = null;
        }
        this.wait.visible = false;
        CoverLayer.instance.removeCover();
    }

    private static _instance:LoadingLayer;

    public static get instance():LoadingLayer
    {
        if( this._instance )
        {
            return this._instance;
        }
        else
        {
            this._instance = new LoadingLayer();
        }
        return this._instance;
    }
}