/**
 * Created by Gordon on 18/August/15.
 * @class UITool
 * @constructor
 **/
class UITool
{
    public static drawShape( uiAsset:egret.gui.UIAsset, width:number, height:number, color:number ):void
    {
        var shape:egret.Shape = new egret.Shape();
        var g:egret.Graphics = shape.graphics;
        g.beginFill( color );
        g.drawRect( 0, 0, width, height );
        g.endFill();
        uiAsset.source = shape;
    }
    public static redrawShape( uiAsset:egret.gui.UIAsset, width:number, height:number, color:number ):void
    {
        var shape:egret.Shape = uiAsset.content;
        var g:egret.Graphics = shape.graphics;
        g.clear();
        g.beginFill( color );
        g.drawRect( 0, 0, width, height );
        g.endFill();
        uiAsset.source = shape;
    }
}