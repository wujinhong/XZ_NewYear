/**
 * Created by Gordon on 14/August/15.
 * @class Layer
 * @constructor
 **/
class Layer
{
    /** panel 专用*/
    public static UI:egret.DisplayObjectContainer;

    /**只加提示文本*/
    public static TIP:egret.DisplayObjectContainer;
    public static LOADING:egret.DisplayObjectContainer;

    public static WIDTH:number;
    public static HEIGHT:number;

    private static bugText:egret.TextField;

    public static init( stage:egret.Stage ):void
    {
        Layer.WIDTH = stage.stageWidth;
        Layer.HEIGHT = stage.stageHeight;

        this.UI = new egret.DisplayObjectContainer();
        this.TIP = new egret.DisplayObjectContainer();
        this.LOADING = new egret.DisplayObjectContainer();

        stage.addChild( Layer.UI );
        stage.addChild( this.TIP );
        stage.addChild( this.LOADING );

        //Layer.bugText = new egret.TextField();
        //Layer.bugText.textColor = 0x000000;
        //Layer.bugText.multiline = true;
        //stage.addChild( Layer.bugText );
    }
}