/**
 * Created by Gordon on 16/August/15.
 * @class ImageDataUtil
 * @constructor
 **/
class ImageDataUtil
{
    private static _canvas;

    private static get canvas():any
    {
        if( null == ImageDataUtil._canvas )
        {
            ImageDataUtil._canvas = document.createElement( "canvas" );
        }
        return ImageDataUtil._canvas;
    }

    public static changeTexture( texture:egret.Texture, color:number, point:egret.Point = null ):boolean
    {
        var img = texture._bitmapData;
        var canvas = ImageDataUtil.canvas;
        var ctx = canvas.getContext( "2d" );
        var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;

        var sourceWidth = img.width;
        var sourceHeight = img.height;
        var width = sourceWidth * texture_scale_factor;
        var height = sourceHeight * texture_scale_factor;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect( 0, 0, width, height );

        ctx.drawImage( img, 0, 0, sourceWidth, sourceHeight, 0, 0, width, height );

        var imgData;
        if( null != point )
        {
            imgData = ctx.getImageData( point.x, point.y, 1, 1 );
            if( 0 == imgData.data[ 3 ] )
            {//alpha为0，是纯透明则跳过
                return false;
            }
        }
        imgData = ctx.getImageData( 0, 0, width, height );

        //核心代码必需明白位运算：一个比特位有0、1两个状态，2的四次方是16，所以16进制的一个数字刚好是四个比特位，所以清除4个零要移 >> 16
        var R = ( 0xFF0000 & color ) >> 16;
        var G = ( 0x00FF00 & color ) >> 8;
        var B = 0x0000FF & color;

        var data = imgData.data;
        var num = data.length;
        for( var i = 0; i < num; i += 4 )
        {
            if( 0 == data[ i + 3 ] )
            {//alpha为0，是纯透明则跳过
                continue;
            }
            data[ i + 0 ] = R;
            data[ i + 1 ] = G;
            data[ i + 2 ] = B;
        }

        ctx.clearRect( 0, 0, width, height );

        ctx.putImageData( imgData, 0, 0 );

        var image = canvas.toDataURL( "image/png" );

        texture._bitmapData.src = image;
        texture[ 'currentSrc' ] = image;

        return true;
    }

    public static saveImage( x:number, y:number, width:number, height:number, upload:boolean = false ):any
    {
        var imgData = egret.MainContext.instance.rendererContext[ 'canvasContext' ].getImageData( x, y, width, height );

        var canvas = ImageDataUtil.canvas;
        var ctx = canvas.getContext( "2d" );

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect( 0, 0, width, height );

        ctx.putImageData( imgData, 0, 0 );

        var image = canvas.toDataURL( "image/png" );

        if( upload )
        {
            return image;
        }

        /*if( Platform.isWeiXin )
        {
            var w=window.open('about:blank','长按保存图片');
            w.document.write("<img src='"+image+"'/>");
            return;
        }
        window.location.href = image;*/

        var element = document.getElementById( 'myPaint' );
        element[ 'src' ] = image;
        window[ 'showPaint' ]();
    }
}