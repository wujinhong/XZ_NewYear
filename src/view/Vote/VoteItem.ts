/**
 * Created by Gordon on 18/August/15.
 * @class VoteItem
 * @constructor
 **/
class VoteItem extends egret.gui.ItemRenderer
{
    private isCreated:boolean = false;

    private bg:egret.gui.UIAsset;
    private img:egret.gui.UIAsset;

    private voteBtn:egret.gui.Button;

    private IDlabel:egret.gui.Label;
    private hotLabel:egret.gui.Label;
    private authorLabel:egret.gui.Label;


    constructor()
    {
        super();
        this.skinName = skins.vote.VoteItemSkin;
    }

    public childrenCreated():void
    {
        this.voteBtn.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onTap, this );
        UITool.drawShape( this.bg, 220, 220, Color.ORANGE );

        this.isCreated = true;
        this.dataChanged();
    }

    private onTap( e:egret.TouchEvent ):void
    {
        if( this.voteBtn === e.target )
        {
            Http.instance.vote( { id:this.data.id }, this.onVote, this );
            return;
        }
    }
    private onVote( data:any ):void
    {
        var str:string = ( 1 == data.code ? '您已经成功投票给作品' + this.data.id : data.msg );
        Tip.instance.showTip( str );
    }
    /**
     * 数据填充
     */
    public dataChanged():void
    {
        if( !this.isCreated )
        {
            return;
        }
        this.IDlabel.text = 'I D:' + this.data.id;
        this.hotLabel.text = '热度:' + this.data.vote;
        this.authorLabel.text = '作者:' + this.data.name;

        RES.getResByUrl( 'http://' + Global.HOST + this.data.img, ( texture:egret.Texture )=>{
            //RES.getResByUrl( this.data.img, ( texture:egret.Texture )=>{//测试代码
            this.img.source = texture;
        }, this );
    }
}