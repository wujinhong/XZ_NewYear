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

        /**
         * 主拼图全部线条
         */
        private canvas:egret.gui.UIAsset;
        /**
         * 左下角拼图全部线条
         */
        private canvas0:egret.gui.UIAsset;

        private shape:egret.gui.UIAsset;

        /**
         * 拼图纯色背影
         */
        private bg:egret.gui.UIAsset;
        /**
         * 弹窗黑色背影
         */
        private coverBg:egret.gui.UIAsset;

        private drag:egret.gui.Group;
        private group:egret.gui.Group;
        /**
         * 颜色点击状态
         */
        private choosen:egret.gui.UIAsset;

        private choosenPen:number = 0;

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

        private choosenColor:number = 0x8C8C8C;//this.colors[ 0 ][ 3 ];

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

            UITool.drawShape( this.bg, 480, 516, 0xFFFFFF );
            this.bg.content.touchEnabled = true;

            RES.getResAsync( 'CfgGraphics_json', this.onCfgGraphics_json, this );

            this.uploadUI.visible = false;
            this.uploadUI.touchEnabled = false;
            this.uploadUI.touchChildren = true;

            this.setChoosenColor( 3 );

            this.drawShape( 0 );
        }

        private painIdx:number = 1;
        private positions:Array<any>;

        private onCfgGraphics_json( positions:Array<Object> ):void
        {
            this.positions = positions;
            RES.getResAsync( this.painIdx + '_png', this.initPain, this );
        }

        private initPain( texture:egret.Texture = null ):void
        {
            var pos:any = this.positions[ this.painIdx - 1 ];

            if( 42 == this.painIdx )
            {
                texture = RES.getRes( '42' );
                this.canvas.touchEnabled = false;
                this.canvas.touchChildren = false;
                this.canvas.source = texture;
                this.canvas.x = pos.localX - texture.textureWidth / 2;
                this.canvas.y = pos.localY - texture.textureHeight / 2;
                this.painIdx++;
                RES.getResAsync( this.painIdx + '_png', this.initPain, this );
                return;
            }

            if( 50 == this.painIdx )
            {
                texture = RES.getRes( '50' );
                this.canvas0.touchEnabled = false;
                this.canvas0.touchChildren = false;
                this.canvas0.source = texture;
                this.canvas0.x = pos.localX - texture.textureWidth / 2;
                this.canvas0.y = pos.localY - texture.textureHeight / 2 + 30;
                return;
            }

            var uiAsset:egret.gui.UIAsset = new egret.gui.UIAsset( texture );
            uiAsset.x = pos.localX - texture.textureWidth / 2;
            uiAsset.y = pos.localY - texture.textureHeight / 2 - 107;
            this.group.addElement( uiAsset );

            if( this.painIdx >= 43 )
            {
                uiAsset.y += 30;
            }

            this.painIdx++;
            RES.getResAsync( this.painIdx + '_png', this.initPain, this );
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

        private touches:Array<number> = [];
        private _x:number = 0;
        private _y:number = 0;
        /**
         * (_x,_y)与(_x2,_y2)中心点坐标
         **/
        private mPoint:egret.Point;
        private _x2:number = 0;
        private _y2:number = 0;
        /**
         * 判断单击事件
         * @type {number}
         */
        private startX:number = 0;
        private startY:number = 0;

        private onBegin( e:egret.TouchEvent ):void
        {
            var touches:Array<number> = this.touches;
            if( touches.length < 2 )
            {
                if( touches[ 0 ] != e.touchPointID )
                {
                    touches.push( e.touchPointID );
                }
            }

            if( 1 == touches.length )
            {
                this.drag.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.onMove, this );
                this.drag.addEventListener( egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onReleaseOutside, this );
                this.drag.addEventListener( egret.TouchEvent.TOUCH_END, this.onEnd, this );

                this.startX = this._x = e.stageX;
                this.startY = this._y = e.stageY;
                return;
            }

            if( 2 == touches.length )
            {
                this._x2 = e.stageX;
                this._y2 = e.stageY;

                var xdiff = e.stageX - this._x;
                var ydiff = e.stageY - this._y;

                this.disdance =  Math.sqrt( ( xdiff * xdiff + ydiff * ydiff ) );

                xdiff = ( this._x2 + this._x ) / 2;
                ydiff = ( this._y2 + this._y ) / 2;

                this.mPoint = this.globalToLocal( xdiff, ydiff, this.mPoint );
            }
        }

        private disdance:number;

        private onEnd( e:egret.TouchEvent ):void
        {
            if( this.drag.hasEventListener( egret.TouchEvent.TOUCH_MOVE ) )
            {
                this.drag.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.onMove, this );
                this.drag.removeEventListener( egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onReleaseOutside, this );
                this.drag.removeEventListener( egret.TouchEvent.TOUCH_END, this.onEnd, this );
            }

            if( this.startX == e.stageX && this.startY == e.stageY )
            {
                this.paintCanvas( e );
            }

            var touches:Array<number> = this.touches;
            touches.splice( 0, touches.length );
        }

        private onMove( e:egret.TouchEvent ):void
        {
            var d:egret.gui.Group = this.drag;
            var touches:Array<number> = this.touches;
            if( touches.length == 1 )
            {
                d.x += e.stageX - this._x;
                d.y += e.stageY - this._y;

                this._x = e.stageX;
                this._y = e.stageY;
            }
            else
            {
                var xdiff = ( this._x2 + this._x ) / 2;
                var ydiff = ( this._y2 + this._y ) / 2;
                this.mPoint = this.globalToLocal( xdiff, ydiff, this.mPoint );

                if( touches[ 0 ] == e.touchPointID )
                {
                    this._x = e.stageX;
                    this._y = e.stageY;
                }
                else if( touches[ 1 ] == e.touchPointID )
                {
                    this._x2 = e.stageX;
                    this._y2 = e.stageY;
                }
                else
                {
                    return;
                }
                xdiff = ( this._x2 + this._x ) / 2;
                ydiff = ( this._y2 + this._y ) / 2;

                var d:egret.gui.Group = this.drag;
                var point:egret.Point = this.tapPoint = this.globalToLocal( xdiff, ydiff, this.tapPoint );
                d.x += ( point.x - this.mPoint.x );
                d.y += ( point.y - this.mPoint.y );

                //缩放
                xdiff = this._x2 - this._x;
                ydiff = this._y2 - this._y;
                var disdance =  Math.sqrt( ( xdiff * xdiff + ydiff * ydiff ) );
                var scale = disdance / this.disdance;
                var d:egret.gui.Group = this.drag;
                d.scaleX *= scale;
                d.scaleY *= scale;
                this.disdance = disdance;
            }
        }

        private onReleaseOutside( e:egret.TouchEvent ):void
        {
            var touches:Array<number> = this.touches;
            touches.splice( 0, touches.length );

            if( this.drag.hasEventListener( egret.TouchEvent.TOUCH_MOVE ) )
            {
                this.drag.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.onMove, this );
                this.drag.removeEventListener( egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onReleaseOutside, this );
                this.drag.removeEventListener( egret.TouchEvent.TOUCH_END, this.onEnd, this );
            }
        }

        private paintCanvas( e:egret.TouchEvent ):void
        {
            var target = e.target;

            if( this.group === target.parent && target instanceof egret.gui.UIAsset )
            {
                var point:egret.Point = this.tapPoint = this.group.globalToLocal( e.stageX, e.stageY, this.tapPoint );
                var posX:number = point.x;
                var posY:number = point.y;
                var num:number = this.group.numElements;
                for( var index:number = num - 1; index >= 0; index-- )
                {
                    var element:egret.gui.UIAsset = <egret.gui.UIAsset>this.group.getElementAt( index );
                    if( posX >= element.x && posX <= element.x + element.width &&
                        posY >= element.y && posY <= element.y + element.height )
                    {
                        if( element.hitTestPoint( e.stageX, e.stageY, true ) )
                        {
                            var texture:egret.Texture = element.content;
                            ImageDataUtil.changeTexture( texture, this.choosenColor );
                            return;
                        }
                    }
                }
            }

            if( this.bg === target || this.bg.hitTest( e.stageX, e.stageY ) )
            {
                this.redrawBg();
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

            this.drag.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this );
        }

        public onClose( ...args:any[] ):void
        {
            this.removeEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );

            this.drag.removeEventListener( egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this );
        }

        public onUpdate( ...args:any[] ):void
        {

        }

        private tapPoint:egret.Point;

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
                var num:number = this.group.numElements;
                for( var index:number = 0; index < num; index++ )
                {
                    var element:egret.gui.UIAsset = <egret.gui.UIAsset>this.group.getElementAt( index );
                    ImageDataUtil.changeTexture( element.content, 0xFFFFFF );
                }
                this.redrawBg( true );
                return;
            }
            if( this.saveBtn === target )
            {
                ImageDataUtil.saveImage( this.group.x, this.group.y, this.group.width, this.group.height );
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

        private redrawBg( white:boolean = false ):void
        {
            UITool.redrawShape( this.bg, 480, 516, white ? 0xFFFFFF : this.choosenColor );
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

                //测试代码
                this.uploadUI.anchorX = 0.3;
                this.uploadUI.anchorY = 0.3;
                this.uploadUI.scaleX = this.uploadUI.scaleY = 0.5;
            }

            this.upload.onUpdate( ImageDataUtil.saveImage( this.group.x, this.group.y, this.group.width, this.group.height, true ) );
            this.upload.onShow();
        }

        public hideCoverBg():void
        {
            this.coverBg.visible = false;
        }
    }
}