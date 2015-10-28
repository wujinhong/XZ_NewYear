/**
 * Created by Gordon on 17/August/15.
 * @class Paint 整个放在Draw.drag中被拖动
 * @constructor
 **/
module view
{
    export class Paint extends egret.gui.SkinnableComponent
    {
        private isCreated:boolean = false;

        private draw:view.Draw;

        /**
         * 主拼图全部线条
         */
        private canvas:egret.gui.UIAsset;
        /**
         * 左下角拼图全部线条
         */
        private canvas1:egret.gui.UIAsset;
        /**
         * 拼图纯色背影
         */
        private bg:egret.gui.UIAsset;
        /**
         * 色块容器
         */
        public group:egret.gui.Group;

        public constructor( draw:view.Draw )
        {
            super();
            this.skinName = skins.draw.PaintSkin;
            this.draw = draw;
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
            UITool.drawShape( this.bg, 480, 516, 0xFFFFFF );
            this.bg.content.touchEnabled = true;
            RES.getResAsync( 'CfgGraphics_json', this.onCfgGraphics_json, this );
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
                this.canvas.y = pos.localY - texture.textureHeight / 2 - 107;
                this.painIdx++;
                RES.getResAsync( this.painIdx + '_png', this.initPain, this );
                return;
            }

            if( 50 == this.painIdx )
            {
                texture = RES.getRes( '50' );
                this.canvas1.touchEnabled = false;
                this.canvas1.touchChildren = false;
                this.canvas1.source = texture;
                this.canvas1.x = pos.localX - texture.textureWidth / 2;
                this.canvas1.y = pos.localY - texture.textureHeight / 2 - 107 + 30;
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

        public recoverColor():void
        {
            var num:number = this.group.numElements;
            for( var index:number = 0; index < num; index++ )
            {
                var element:egret.gui.UIAsset = <egret.gui.UIAsset>this.group.getElementAt( index );
                ImageDataUtil.changeTexture( element.content, 0xFFFFFF );
            }
            this.redrawBg( true );
        }


        public onShow( ...args:any[] ):void
        {
            if( !this.isCreated )
            {
                return;
            }

            this.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this );
        }

        public onClose( ...args:any[] ):void
        {
            this.removeEventListener( egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this );
        }

        public onUpdate( ...args:any[] ):void
        {

        }

        private onTap( e:egret.TouchEvent ):void
        {
            //e.stopImmediatePropagation();
            e.stopPropagation();

            var target = e.target;
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
                            ImageDataUtil.changeTexture( texture, this.draw.choosenColor );
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

        private tapPoint:egret.Point;

        private redrawBg( white:boolean = false ):void
        {
            UITool.redrawShape( this.bg, 480, 516, white ? 0xFFFFFF : this.draw.choosenColor );
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
                this.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.onMove, this );
                this.addEventListener( egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onReleaseOutside, this );
                this.addEventListener( egret.TouchEvent.TOUCH_END, this.onEnd, this );

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
                this.mPoint = this.draw.globalToLocal( xdiff, ydiff, this.mPoint );

                var d:egret.gui.UIAsset = this.draw.drag;
                //无缩放的左上角坐标点
                var leftTopX:number = d.x - d.anchorX * d.width;
                var leftTopY:number = d.y - d.anchorY * d.height;

                d.anchorX = ( this.mPoint.x - leftTopX ) / d.width;
                d.anchorY = ( this.mPoint.y - leftTopY ) / d.height;

                d.x = this.mPoint.x;
                d.y = this.mPoint.y;
            }
        }

        private disdance:number;

        private onEnd( e:egret.TouchEvent ):void
        {
            if( this.hasEventListener( egret.TouchEvent.TOUCH_MOVE ) )
            {
                this.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.onMove, this );
                this.removeEventListener( egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onReleaseOutside, this );
                this.removeEventListener( egret.TouchEvent.TOUCH_END, this.onEnd, this );
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
            var d:egret.gui.UIAsset = this.draw.drag;
            var touches:Array<number> = this.touches;
            if( touches.length == 1 )
            {
                var scale:number = d.scaleX;
                var width:number = d.width * scale;
                var xx:number = e.stageX - this._x;
                var _x:number = d.x + xx;
                var leftTopX:number = _x - d.anchorX * width;
                var maxX:number = 480 - width;

                if( ( leftTopX >= maxX && leftTopX <= 0 ) ||
                    ( leftTopX > 0 && xx < 0 ) || ( leftTopX < maxX && xx > 0 ) )
                {
                    var height:number = d.height * scale;
                    var yy = e.stageY - this._y;
                    var _y = d.y + yy;
                    var leftTopY:number = _y - d.anchorY * height;
                    var topY = 107 * scale - 107;
                    var maxY:number = 516 - height;

                    if( ( leftTopY >= maxY && leftTopY <= topY ) ||
                        ( leftTopY > topY && yy < 0 ) || ( leftTopY < maxY && yy > 0 ) )
                    //if( ( leftTopY >= maxY && leftTopY <= 0 ) ||
                    //    ( leftTopY > 0 && yy < 0 ) || ( leftTopY < maxY && yy > 0 ) )
                    {
                        d.x += e.stageX - this._x;
                        d.y += e.stageY - this._y;

                        this._x = e.stageX;
                        this._y = e.stageY;
                    }
                }
            }
            else
            {
                var _x = this._x;
                var _y = this._y;
                var _x2 = this._x2;
                var _y2 = this._y2;

                if( touches[ 0 ] == e.touchPointID )
                {
                    _x = e.stageX;
                    _y = e.stageY;
                }
                else if( touches[ 1 ] == e.touchPointID )
                {
                    _x2 = e.stageX;
                    _y2 = e.stageY;
                }
                else
                {
                    return;
                }

                //缩放
                var xdiff = _x2 - _x;
                var ydiff = _y2 - _y;
                var disdance =  Math.sqrt( ( xdiff * xdiff + ydiff * ydiff ) );
                var scale = disdance / this.disdance * d.scaleX;
                if( scale > 1 && scale < 2 )
                {
                    d.scaleX = scale;
                    d.scaleY = scale;
                    this.disdance = disdance;

                    this._x = this._x;
                    this._y = this._y;
                    this._x2 = this._x2;
                    this._y2 = this._y2;
                }
            }
        }

        /**
         * 恢复坐标、大小
         */
        public restore():void
        {
            this.draw.drag.x = this.draw.drag.y = 0;
            this.draw.drag.scaleX = this.draw.drag.scaleY = 1;
            this.draw.drag.anchorX = this.draw.drag.anchorY = 0;
        }


        private onReleaseOutside( e:egret.TouchEvent ):void
        {
            var touches:Array<number> = this.touches;
            touches.splice( 0, touches.length );

            if( this.hasEventListener( egret.TouchEvent.TOUCH_MOVE ) )
            {
                this.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.onMove, this );
                this.removeEventListener( egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onReleaseOutside, this );
                this.removeEventListener( egret.TouchEvent.TOUCH_END, this.onEnd, this );
            }
        }
    }
}