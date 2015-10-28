/**
 * Created by Gordon on 13/August/15.
 * @class Draw
 * @constructor
 **/
module view
{
    export class Draw extends egret.gui.SkinnableComponent implements IPanel
    {
        private isChildrenCreated:boolean = false;

        private exitBtn:egret.gui.Button;
        private againBtn:egret.gui.Button;
        private saveBtn:egret.gui.Button;
        private uploadBtn:egret.gui.Button;

        private choosenPen:number = 0;
        /**
         * 一只笔对应的所有egret.Shape色块
         */
        private shape:egret.gui.UIAsset;
        /**
         * 颜色点击状态
         */
        private choosen:egret.gui.UIAsset;

        /**
         * 弹窗黑色背影
         */
        private coverBg:egret.gui.UIAsset;

        public bg0:egret.gui.UIAsset;
        public bg:egret.gui.UIAsset;
        public bg2:egret.gui.UIAsset;

        public drag:egret.gui.UIAsset;
        private paint:Paint;

        public uploadUI:egret.gui.UIAsset;
        private upload:Upload;

        private colors:Array<any> = [
            [ 0xFFFFFF, 0xBFBFBF, 0xA6A6A6, 0x8C8C8C, 0x666666, 0x595959, 0x404040, 0x000000 ],
            [ 0xFFDC85, 0xFFC966, 0xFFA640, 0xFF7F24, 0xFF6817, 0xAD411F, 0x853512, 0x731B00 ],
            [ 0xB0F7FF, 0x8FF4FF, 0x75E3FF, 0x40D9FF, 0x00CCFF, 0x00A2F2, 0x0078DB, 0x0E38B5 ],
            [ 0xF8FFC2, 0xF7FF80, 0xFFF71C, 0xFFE700, 0xFFD500, 0xCC9816, 0xA17017, 0x91540C ],
            [ 0xFFD9C9, 0xFFB9B0, 0xFF8080, 0xFF6363, 0xFF0000, 0x9E1F1F, 0x6E1818, 0x4D0000 ],
            [ 0xB3FFCB, 0x96FFB8, 0x70FFD9, 0x33FFC8, 0x13E8B3, 0x11BF91, 0x0D9E89, 0x00807B ],
            [ 0xDAFF73, 0xC1FF45, 0x8FFF1F, 0x66F71E, 0x00E600, 0x20BD32, 0x129633, 0x02783D ],
            [ 0xB9ABFF, 0xA785FF, 0x9B69FF, 0x9147FF, 0xAF26FF, 0x9123D1, 0x7C10A1, 0x620082 ],
            [ 0xF1B5FF, 0xF78CFF, 0xFF69F8, 0xFF42E0, 0xFF00B7, 0xC7008F, 0x992677, 0x850F62 ]
        ];

        public choosenColor:number = 0x8C8C8C;//this.colors[ 0 ][ 3 ];

        private shapes:Array<any> = new Array( 9 );

        public constructor()
        {
            super();
            this.skinName = skins.draw.DrawSkin;
            egret.MainContext.instance.touchContext.maxTouches = 2;
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
            this[ 'pen0' ].y -= 30;

            //颜色点击选中白框
            var shape:egret.Shape = new egret.Shape();
            var g:egret.Graphics = shape.graphics;
            g.beginFill( 0xFFFFFF );
            g.drawRect( 0, 0, 60, 5 );
            g.endFill();
            g.beginFill( 0xFFFFFF );
            g.drawRect( 0, 5, 5, 30 );
            g.endFill();
            g.beginFill( 0xFFFFFF );
            g.drawRect( 55, 5, 5, 30 );
            g.endFill();
            g.beginFill( 0xFFFFFF );
            g.drawRect( 0, 35, 60, 5 );
            g.endFill();
            this.choosen.source = shape;

            UITool.drawShape( this.bg0, 480, 516, Color.ORANGE );
            UITool.drawShape( this.bg, 480, 107, Color.ORANGE );
            UITool.drawShape( this.bg2, 480, 177, Color.ORANGE );

            this.paint = new view.Paint( this );
            this.drag.source = this.paint;
            this.drag.touchEnabled = true;
            this.drag.touchChildren = true;

            this.uploadUI.visible = false;
            this.uploadUI.touchEnabled = false;
            this.uploadUI.touchChildren = true;

            this.setChoosenColor( 3 );

            this.drawShape( 0 );
        }

        private setChoosenPen( index:number ):void
        {
            this[ 'pen' + this.choosenPen ].y += 30;
            this.choosenPen = index;
            this[ 'pen' + this.choosenPen ].y -= 30;

            this.drawShape( index );
            this.setChoosenColor( 3 );
        }

        private setChoosenColor( index:number ):void
        {
            this.choosenColor = this.colors[ this.choosenPen ][ index ];
            this.choosen.x = index * 60;
        }

        /**
         * 画笔对应多个色块
         * @param index
         */
        private drawShape( index:number ):void
        {
            if( null != this.shapes[ index ] )
            {
                this.shape.source = this.shapes[ index ];
                return;
            }
            var sprite:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            var color:Array<number> = this.colors[ index ];
            for( var i:number = 0; i < 8; i++ )
            {
                var shape:egret.Shape = new egret.Shape();
                shape.x = i * 60;
                var g:egret.Graphics = shape.graphics;
                g.beginFill( color[ i ] );
                g.drawRect( 0, 0, 60, 40 );
                g.endFill();
                sprite.addChild( shape );
            }
            this.shapes[ index ] = sprite;
            this.shape.source = sprite;
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


        private onTap( e:egret.TouchEvent ):void
        {
            var target = e.target;

            if( this.exitBtn === target )
            {
                UIMgr.instance.show( PanelName.GAME_PANEL );
                return;
            }
            if( this.againBtn === target )
            {
                this.paint.restore();
                this.paint.recoverColor();
                return;
            }
            if( this.saveBtn === target )
            {
                this.paint.restore();
                egret.setTimeout( ()=>{
                    ImageDataUtil.saveImage( this.paint.group.x, this.paint.group.y, this.paint.group.width, this.paint.group.height );
                }, this, 100 );
                return;
            }
            if( this.uploadBtn === target )
            {
                this.showCommite();
                return;
            }

            if( e.localY >= 760 )
            {
                this.setChoosenColor( Math.floor( e.localX / 60 ) );
                return;
            }

            for( var index:number = 0; index < 9; index++ )
            {
                if( target === this[ 'pen' + index ] )
                {
                    this.setChoosenPen( index );
                    return;
                }
            }
        }

        private drawCoverBg():void
        {
            if( null == this.coverBg.content )
            {
                var shape:egret.Shape = new egret.Shape();
                var g:egret.Graphics = shape.graphics;
                g.beginFill( 0x000000, 0.5 );
                g.drawRect( 0, 0, 480, 800 );
                g.endFill();
                this.coverBg.source = shape;
            }
        }

        private showCommite():void
        {
            this.drawCoverBg();
            this.coverBg.visible = true;
            if( null == this.upload )
            {
                this.upload = new Upload( this );
                this.uploadUI.source = this.upload;
            }

            this.paint.restore();

            egret.setTimeout( ()=>{
                this.upload.onUpdate( ImageDataUtil.saveImage( this.paint.group.x, this.paint.group.y, this.paint.group.width, this.paint.group.height, true ) );
                this.upload.onShow();
            }, this, 100 );
        }

        public hideCoverBg():void
        {
            this.coverBg.visible = false;
        }
    }
}