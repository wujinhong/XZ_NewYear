module view
{
    export class Game extends egret.gui.SkinnableComponent implements IPanel
    {
        private isChildrenCreated:boolean = false;

        private startBtn:egret.gui.Button;
        private voteBtn:egret.gui.Button;
        private ruleBtn:egret.gui.Button;

        public constructor()
        {
            super();
            this.skinName = skins.GameSkin;
        }

        public childrenCreated():void
        {
            super.childrenCreated();
            this.isChildrenCreated = true;
            this.onShow();
        }

        private onTap( e:egret.TouchEvent ):void
        {
            if( this.startBtn === e.target )
            {
                UIMgr.instance.show( PanelName.DRAW_PANEL );
                return;
            }
            if( this.voteBtn === e.target )
            {
                UIMgr.instance.show( PanelName.VOTE_PANEL );
                return;
            }
            if( this.ruleBtn === e.target )
            {
                UIMgr.instance.show( PanelName.RULE_PANEL );
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
