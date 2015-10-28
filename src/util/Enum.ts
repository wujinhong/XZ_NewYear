/**
 * Created by Gordon on 22/12/14.
 */
class Enum
{
    private static index:number = 0;
    public static start():number
    {
        this.index = 0;
        return this.index;
    }
    public static next():number
    {
        return ++this.index;
    }
}