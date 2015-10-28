/**
 * Created by Gordon on 17/August/15.
 * @class Upload
 * @constructor
 **/
module view
{
    export class Upload extends egret.gui.SkinnableComponent
    {
        private isCreated:boolean = false;

        private draw:view.Draw;

        /** 主面板 begain **/
        private uploadGroup:egret.gui.Group;

        private uploadBg:egret.gui.UIAsset;

        private inputName:egret.gui.EditableText;
        private warnName:egret.gui.Label;
        private inputPhoneNum:egret.gui.EditableText;
        private warnPhoneNum:egret.gui.Label;
        private inputAddress:egret.gui.EditableText;
        private warnAddress:egret.gui.Label;
        private inputBless:egret.gui.EditableText;

        private commitBtn:egret.gui.Button;
        private cancelBtn:egret.gui.Button;
        /** 主面板 end **/

        /** 上传进度面板 begain **/
        private uploading:egret.gui.Group;
        private uploadingBg:egret.gui.UIAsset;
        private processBg:egret.gui.UIAsset;
        private bar:egret.gui.UIAsset;
        private barMask:egret.Rectangle;
        private processLabel:egret.gui.Label;
        /** 上传进度面板 end **/

        /** 上传结果面板 begain **/
        private resultGroup:egret.gui.Group;
        private resultGroupBg:egret.gui.UIAsset;

        private IDLabel:egret.gui.Label;

        private shareBtn:egret.gui.Button;
        private continueBtn:egret.gui.Button;
        /** 上传进度面板 end **/

        private image:any;

        public constructor( draw:view.Draw )
        {
            super();
            this.skinName = skins.draw.UploadSkin;
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
            UITool.drawShape( this.uploadBg, 460, 560, 0xFFFFFF );

            this.resultGroup.visible = false;
            this.uploading.visible = false;
        }

        private commit():void
        {
            if( this.checkInput() )
            {
                this.drawLoading();
                this.processLabel.text = '0%';

                this.uploadGroup.visible = false;
                this.uploading.visible = true;

                var userName:string = this.inputName.text;
                var phoneNum:string = this.inputPhoneNum.text;
                var address:string = this.inputAddress.text;
                var bless:string = this.inputBless.text;

                var param:any = { name:userName,
                    phone:phoneNum,
                    adr:address,
                    img:this.image,
                    message:bless
                };
                PostImage.instance.send( param, this.onLoad, this, this.onProcess );
            }
        }

        private drawLoading():void
        {
            if( null == this.uploadingBg.content )
            {
                UITool.drawShape( this.uploadingBg, 460, 120, 0xFFFFFF );
                UITool.drawShape( this.processBg, this.processBg.width, this.processBg.height, Color.GRAY );
                UITool.drawShape( this.bar, this.bar.width, this.bar.height, Color.ORANGE );

                this.barMask = new egret.Rectangle( 0, 0, this.bar.width, this.bar.height );
                this.bar.mask = this.barMask;
            }
        }
        private drawResult():void
        {
            if( null == this.resultGroupBg.content )
            {
                UITool.drawShape( this.resultGroupBg, this.resultGroup.width, this.resultGroup.height, 0xFFFFFF );
            }
        }

        private onLoad( data:any ):void
        {
            this.uploading.visible = false;

            if( 1 == data.code )
            {
                this.drawResult();
                this.resultGroup.visible = true;
                this.IDLabel.text = data.id;
            }
            else
            {
                Tip.instance.showTip( data.msg )
            }
        }
        private onProcess( e:egret.ProgressEvent ):void
        {
            var percent:number = e.bytesLoaded / e.bytesTotal;
            console.log( percent );
            var str:string = ( percent * 100 ).toString();

            this.processLabel.text = str.substr( 0, 4 ) + '%';
            this.barMask.width = e.bytesLoaded / e.bytesTotal * this.bar.width;
        }

        private checkInput():boolean
        {
            var userName:string = this.inputName.text;
            if( userName.length < 2 )
            {
                this.warnName.visible = true;
                return false;
            }
            else
            {
                this.warnName.visible = false;
            }
            /*if( !Global.isChineseName( userName ) )
            {
                this.warnName.visible = true;
                return false;
            }
            else
            {
                this.warnName.visible = false;
            }*/

            var phoneNum:string = this.inputPhoneNum.text;
            if( !Global.isPhoneNum( phoneNum ) )
            {
                this.warnPhoneNum.visible = true;
                return false;
            }
            else
            {
                this.warnPhoneNum.visible = false;
            }
            var address:string = this.inputAddress.text;
            if( address.length < 1 )
            {
                this.warnAddress.visible = true;
                return false;
            }

            this.warnAddress.visible = false;
            return true;
        }

        public onShow( ...args:any[] ):void
        {
            if( !this.isCreated )
            {
                return;
            }

            this.warnName.visible = false;
            this.warnPhoneNum.visible = false;
            this.warnAddress.visible = false;

            this.inputName.text = '';
            this.inputPhoneNum.text = '';
            this.inputAddress.text = '';

            //测试代码
            //this.inputName.text = '有有';
            //this.inputPhoneNum.text = '55555111333';
            //this.inputAddress.text = '朋';

            document.onkeyup = ()=>{
                this.checkInput();
            };

            this.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );
            this.draw.uploadUI.visible = true;
            this.uploadGroup.visible = true;
        }

        public onClose( ...args:any[] ):void
        {
            this.removeEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );
            this.draw.uploadUI.visible = false;
            this.draw.hideCoverBg();

            document.onkeyup = null;
        }

        public onUpdate( ...args:any[] ):void
        {
            var str:string = args[ 0 ];
            this.image = str.substring( 22 );
            //this.image = str.split( ',' )[ 1 ];

            this.image = encodeURIComponent( this.image );
        }

        private onTap( e:egret.TouchEvent ):void
        {
            //e.stopImmediatePropagation();
            e.stopPropagation();

            var target = e.target;

            if( this.cancelBtn === target )
            {
                this.onClose();
                return;
            }
            if( this.commitBtn === target )
            {
                this.commit();
                return;
            }
            if( this.shareBtn === target )
            {
                window[ 'weChat' ]();
                return;
            }
            if( this.continueBtn === target )
            {
                this.resultGroup.visible = false;
                this.uploadGroup.visible = true;
                this.onClose();
                return;
            }
        }
    }
}