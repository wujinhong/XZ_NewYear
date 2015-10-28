/**
 * Created by Gordon on 14/August/15.
 * @class Vote
 * @constructor
 **/
module view
{
    export class Vote extends egret.gui.SkinnableComponent implements IPanel
    {
        private isCreated:boolean = false;

        private scrollerDisplay:egret.gui.Scroller;

        private shape:egret.gui.UIAsset;
        private downBg:egret.gui.UIAsset;

        private exitBtn:egret.gui.Button;
        private joinBtn:egret.gui.Button;

        private leftBtn:egret.gui.Button;
        private rightBtn:egret.gui.Button;

        private input:egret.gui.EditableText;
        private searchBtn:egret.gui.Button;

        private dataGroup:egret.gui.DataGroup;

        private arrayCollection:egret.gui.ArrayCollection;

        private pageIndex:number = 1;
        private pageCount:number = 0;
        /**
         * 排序字段（1-热门；2-新上线）
         * @type {number}
         */
        private orderby:number = 1;

        public constructor()
        {
            super();
            this.skinName = skins.vote.VoteSkin;

            this.arrayCollection = new egret.gui.ArrayCollection();
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

            UITool.drawShape( this.downBg, 480, 40, 0xFFFFFF );

            this.leftBtn[ 'unchoosen' ].visible = false;
            this.rightBtn[ 'choosen' ].visible = false;
            this.rightBtn.labelDisplay[ 'textColor' ] = Color.ORANGE;

            this.dataGroup.percentWidth = 100;
            this.dataGroup.percentHeight = 100;
            this.dataGroup.itemRenderer = new egret.gui.ClassFactory( VoteItem );
            this.dataGroup.dataProvider = this.arrayCollection;
        }

        private onTap( e:egret.TouchEvent ):void
        {
            if( this.exitBtn === e.target )
            {
                UIMgr.instance.show( PanelName.GAME_PANEL );
                return;
            }
            if( this.joinBtn === e.target )
            {
                UIMgr.instance.show( PanelName.GAME_PANEL );
                return;
            }
            if( this.searchBtn === e.target )
            {
                var obj:Object = {id:this.input.text};
                Http.instance.query( obj, this.onSearch, this );
                return;
            }
            if( this.leftBtn === e.target )
            {
                if( 1 == this.orderby )
                {
                    return;
                }
                this.leftBtn[ 'choosen' ].visible = true;
                this.leftBtn[ 'unchoosen' ].visible = false;

                this.rightBtn[ 'choosen' ].visible = false;
                this.rightBtn[ 'unchoosen' ].visible = true;

                this.leftBtn.labelDisplay[ 'textColor' ] = 0xFFFFFF;
                this.rightBtn.labelDisplay[ 'textColor' ] = Color.ORANGE;

                this.orderby = 1;
                this.pageIndex = 1;
                this.getList();
                return;
            }
            if( this.rightBtn === e.target )
            {
                if( 2 == this.orderby )
                {
                    return;
                }
                this.leftBtn[ 'choosen' ].visible = false;
                this.leftBtn[ 'unchoosen' ].visible = true;

                this.rightBtn[ 'choosen' ].visible = true;
                this.rightBtn[ 'unchoosen' ].visible = false;

                this.leftBtn.labelDisplay[ 'textColor' ] = Color.ORANGE;
                this.rightBtn.labelDisplay[ 'textColor' ] = 0xFFFFFF;

                this.orderby = 2;
                this.pageIndex = 1;
                this.getList();
                return;
            }
        }

        private onSearch( data:any ):void
        {
            UIMgr.instance.show( PanelName.VOTE_RESULT_PANEL, null, data );
        }

        public onShow( ...args:any[] ):void
        {
            if( !this.isCreated )
            {
                return;
            }
            this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );

            this.scrollerDisplay.addEventListener( egret.gui.UIEvent.CHANGE_START, this.onChangeStart, this );
            this.scrollerDisplay.addEventListener( egret.gui.UIEvent.CHANGE_END, this.onChangeEnd, this );

            if( this.arrayCollection.length > 0 )
            {
                return;
            }

            this.getList();
        }

        private getList():void
        {
            var param:Object = {
                pageindex:this.pageIndex,
                pagesize:6,
                orderby:this.orderby
            };
            Http.instance.getList( param, this.onGetList, this );
        }

        private onGetList( data:any ):void
        {
            if( 1 == data.code )
            {
                if( data.result.length > 0 )
                {
                    this.pageCount = Math.ceil( data.count / 4 );
                    this.arrayCollection.replaceAll( data.result );
                    return;
                }
            }

            this.pageCount = 0;
            this.arrayCollection.removeAll();
            //this.arrayCollection.addItem()
        }

        public onClose( ...args:any[] ):void
        {
            this.removeEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );
            this.scrollerDisplay.removeEventListener( egret.gui.UIEvent.CHANGE_START, this.onChangeStart, this );
            this.scrollerDisplay.removeEventListener( egret.gui.UIEvent.CHANGE_END, this.onChangeEnd, this );
        }

        public onUpdate( ...args:any[] ):void
        {

        }

        private page:number;
        private maxPage:number;
        private isShowingEffect:boolean = false;
        private curRenderIdx:number = 0;
        private renderArr:any[] = [];
        private startV:number = 0;
        private endV:number = 0;

        private onChangeStart( e:egret.gui.UIEvent ):void
        {
            this.startV = this.dataGroup.verticalScrollPosition;
        }

        private onChangeEnd( e:egret.gui.UIEvent ):void
        {
            console.log( "==========================changeEnd ", this.dataGroup.verticalScrollPosition );
            this.endV = this.dataGroup.verticalScrollPosition;

            if( this.endV - this.startV > 10 )
            {
                this.onPre( null );
            }
            else if( this.endV - this.startV < -10 )
            {
                this.onNext( null );
            }
        }

        private onPre( e:egret.TouchEvent ):void
        {
            if( this.isShowingEffect )
            {
                return;
            }

            var tryPage:number;

            tryPage = Math.max( 0, this.page - 1 );
            if( this.page != tryPage )
            {
                this.page = tryPage;
                this.update();
            }
        }

        private onNext( e:egret.TouchEvent ):void
        {
            if( this.isShowingEffect )
            {
                return;
            }

            var tryPage:number;

            tryPage = Math.min( this.page + 1, this.maxPage );
            if( this.page != tryPage )
            {
                this.page = tryPage;
                this.update();
            }
        }

        public update():void
        {
            var i:number, len:number;
            var dataArr:any[];
            var itemRender:any;

            console.log( "==========================page: ", this.page );

            dataArr = [];

            //len = Math.min(model.UserFriend.friendList.length, 12 * (this.page + 1));
            len = 4;

            for( i = 12 * this.page; i < len; ++i )
            {
                //dataArr.push(model.UserFriend.friendList[i]);
            }

            this.renderArr.length = 0;

            len = this.dataGroup.numElements;
            for( i = 0; i < len; ++i )
            {
                itemRender = this.dataGroup.getElementAt( i );
                if( dataArr[ i ] )
                {
                    itemRender.visible = true;
                    itemRender.data = dataArr[ i ];
                    itemRender.dataChanged();
                    this.renderArr.push( itemRender );
                }
                else
                {
                    itemRender.visible = false;
                }
            }
            this.scrollerDisplay.throwHorizontally( 0 );

            this.showEffect();
        }

        private showEffect():void
        {
            this.isShowingEffect = true;
            this.hideAllRender();
            this.showOneByOne();
        }

        private hideAllRender():void
        {
            var i:number, len:number;
            var itemRender:any;

            len = this.renderArr.length;
            for( i = 0; i < len; ++i )
            {
                itemRender = this.renderArr[ i ];
                itemRender.alpha = 0;
            }
        }

        private showOneByOne():void
        {
            var itemRender:any;


            if( this.renderArr.length == this.curRenderIdx )
            {
                this.endShowOneByOne();
                return;
            }

            itemRender = this.renderArr[ this.curRenderIdx ];
            if( itemRender && itemRender.visible )
            {
                egret.Tween.get( itemRender ).to( {'alpha':1}, 100, egret.Ease.sineIn ).call( ()=>
                {
                    this.curRenderIdx++;
                    this.showOneByOne();
                } );
            }
        }

        private endShowOneByOne():void
        {
            this.isShowingEffect = false;
            this.curRenderIdx = 0;
        }
    }
}