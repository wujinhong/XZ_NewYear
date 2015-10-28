/**
 * Created by Gordon on 14/August/15.
 * @class VoteResult
 * @constructor
 **/
module view
{
    export class VoteResult extends egret.gui.SkinnableComponent implements IPanel
    {
        private isCreated:boolean = false;
        private shape:egret.gui.UIAsset;
        private resultLabel:egret.gui.Label;
        private resultItem:egret.gui.UIAsset;

        private exitBtn:egret.gui.Button;

        private data:any;

        public constructor()
        {
            super();
            this.skinName = skins.vote.ResultSkin;
        }

        public childrenCreated():void
        {
            this.isCreated = true;
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
                UIMgr.instance.show( PanelName.VOTE_PANEL );
                return;
            }
        }

        public onShow( ...args:any[] ):void
        {
            if( !this.isCreated )
            {
                this.data = args[ 0 ];
                return;
            }
            this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );

            var data:any = args[ 0 ] || this.data;
            if( 1 == data.code )
            {
                this.resultItem.visible = true;
                this.resultLabel.visible = false;
                if( null == this.resultItem.content )
                {
                    this.resultItem.source = new VoteItem();
                    this.resultItem.touchChildren = true;
                }

                this.resultItem.content.data = data.result;
            }
            else
            {
                this.resultItem.visible = false;
                this.resultLabel.visible = true;
            }
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