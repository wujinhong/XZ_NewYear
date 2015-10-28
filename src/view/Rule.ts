/**
 * Created by Gordon on 14/August/15.
 * @class Rule
 * @constructor
 **/
module view
{
    export class Rule extends egret.gui.SkinnableComponent implements IPanel
    {
        private isChildrenCreated:boolean = false;
        private shape:egret.gui.UIAsset;

        private exitBtn:egret.gui.Button;

        public constructor()
        {
            super();
            this.skinName = skins.RuleSkin;
        }

        public childrenCreated():void
        {
            this.isChildrenCreated = true;
            this.init();
            this.onShow();
        }

        /**
         * 初始化
         **/
        private init():void
        {
            UITool.drawShape( this.shape, 480, 80, Color.ORANGE );
        }
        private onTap( e:egret.TouchEvent ):void
        {
            if( this.exitBtn === e.target )
            {
                UIMgr.instance.show( PanelName.GAME_PANEL );
                return;
            }
        }
        public onShow( ...args:any[] ):void
        {
            if( !this.isChildrenCreated )
            {
                return;
            }
            this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );
        }

        public onClose( ...args:any[] ):void
        {
            this.removeEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );
        }

        public onUpdate( ...args:any[] ):void
        {

        }
    }
}