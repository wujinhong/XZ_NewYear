/**
 * Created by Gordon on 14/12/22.
 *
 * ui、视图管理类
 *
 * --> 增加一些弹窗或者容器出现的效果
 * 效果处理类，专门负责处理各类显示效果
 */
class UIMgr
{
    static LAYOUT_UI_HEIGHT:number = 630;

    private static mgr:UIMgr;
    private panelArray:Array<IPanel> = new Array( PanelName.PANEL_NUM );

    private args:any[];
    private win:IPanel;
    private param:Object;

    private _isShow:boolean = false;

    public static get instance():UIMgr
    {
        if( !UIMgr.mgr )
        {
            PanelName.init();
            UIMgr.mgr = new UIMgr();
        }
        return UIMgr.mgr;
    }

    private _sprite:egret.Sprite;
    private TouchLayerName:string = "TouchLayer";

    private get touchLayer():egret.Sprite
    {
        if( null != this._sprite )
        {
            return this._sprite;
        }

        this._sprite = new egret.Sprite();
        this._sprite.name = this.TouchLayerName;
        this._sprite.touchEnabled = true;
        this._sprite.touchChildren = true;
        return this._sprite;
    }

    public getPanel( panelName:number ):any
    {
        var win:IPanel = this.panelArray[ panelName ];
        if( null == win )
        {
            win = new PanelName.PANEL_CLASS[ panelName ]();
            this.panelArray[ panelName ] = win;
        }
        return win;
    }

    /**
     * UI 视图效果处理接受函数
     * @param content   处理对象（容器、gui）
     * param:Object 例子：{ "direction":Direction.BOTTOM, "time":500, "ease":egret.Ease.sineIn, alpha:0.3, color:0xFF0000 }
     *      @param direction    窗口进入方向：默认为Direction.BOTTOM; left(左进)、 right(右进)、top(上进)、bottom(下进)、center(中间放大)
     *      @param time         时间,单位毫秒
     *      @param ease         缓动函数  egret.Ease中取值，默认为 egret.Ease.sineIn
     *      @param alpha        背景透明度，默认为 0
     *      @param color        背景颜色
     *      @param hideBg           加模糊背景颜色
     * ...args:any[] IPane 面板onShow传入的参数
     */
    public show( panelName:number, param?:Object, ...args:any[] ):void
    {
        this.win = this.getPanel( panelName );

        if( null == this.win )
        {
            return;
        }
        //判断界面当前是否已经弹出面板，如果有则先消除
        this.closeCurrentPanel( null, 1 );
        this.param = param || {};
        this.args = args;
        this.doShow();
    }

    /**
     *当使用 NONE 方式弹窗，要调用此添加关闭面板事件
     */
    private addPanelClose():void
    {
        console.log( "++++添加面板关闭事件。" );
        this.touchLayer.addEventListener( egret.TouchEvent.TOUCH_TAP, this.closeWindHandler, this );

        var win:any = this.win;
    }

    /**
     * 移除弹窗
     * @param evt
     */
    private closeWindHandler( e?:egret.TouchEvent ):void
    {
        if( null == e.target )
        {
            return;
        }
        var target:any = e.target;
        if( target.name != this.TouchLayerName )
        {
            console.log( target.name );
            return;
        }

        this.closeCurrentPanel();
    }

    /**
     * 关闭当前窗口
     * @param callback
     *          关闭后回调方法
     * @param closeType
     *          关闭方式
     */
    public closeCurrentPanel( callback?:Function, closeType:number = 0, param?:any ):void
    {
        var self = this;
        var target:egret.Sprite = this.touchLayer;
        if( null == target.parent )
        {
            if( null == callback )
            {
                return;
            }
            callback.call( this );
            return;
        }
        var child:any = target.getChildAt( 0 );
        if( null == child )
        {
            if( null == callback )
            {
                return;
            }
            callback.call( this );
            return;
        }

        target.removeEventListener( egret.TouchEvent.TOUCH_TAP, this.closeWindHandler, this );

        console.log( "----删除面板关闭事件。" );

        this.removePanel();
        if( null == callback )
        {
            return;
        }
        callback.call( this );
    }

    private removePanel( param?:any ):void
    {
        var sprite:egret.Sprite = this.touchLayer;
        if( null == sprite.parent )
        {
            return;
        }
        Layer.UI.removeChild( sprite );
        var child:any = sprite.getChildAt( 0 );
        if( null != child )
        {
            var callCloseFunc:boolean = ( null != param && param[ 'callCloseFunc' ] != null ) ? param[ 'callCloseFunc' ] : true;
            callCloseFunc && child.onClose();
            sprite.removeChild( child );
        }

        this._isShow = false;
    }

    public get isShow():boolean
    {
        return this._isShow;
    }

    /**
     * UI 视图效果处理接受函数
     * @param content   处理对象（容器、gui）
     * @param type      默认为=Direction.BOTTOM; left(左进)、 right(右进)、top(上进)、bottom(下进)、center(中间放大)
     * @param time      时间,默认为=200毫秒
     * @param ease      缓动函数  egret.Ease中取值
     */
    private doShow():void
    {
        var content:any = this.win;
        var sprite:egret.Sprite = this.touchLayer;
        sprite.addChild( content );
        Layer.UI.addChild( sprite );

        this.win.onShow.apply( this.win, this.args );

        this.addPanelClose();

        this._isShow = true;
    }
}