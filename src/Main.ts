class Main extends egret.DisplayObjectContainer
{
    public constructor()
    {
        super();
        this.addEventListener( egret.Event.ADDED_TO_STAGE, this.onAddToStage, this );
    }

    private onAddToStage( event:egret.Event )
    {
        this.removeEventListener( egret.Event.ADDED_TO_STAGE, this.onAddToStage, this );

        Layer.init( this.stage );

        egret.Injector.mapClass( "egret.gui.IAssetAdapter", AssetAdapter );
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        egret.gui.Theme.load( "resource/theme.thm" );

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener( RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this );
        RES.loadConfig( "resource/resource.json", "resource/" );
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete( event:RES.ResourceEvent ):void
    {
        RES.removeEventListener( RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this );

        UIMgr.instance.show( PanelName.GAME_PANEL );
    }
}
