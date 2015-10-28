/**
 * Created by Gordon on 22/12/14.
 */
class PanelName
{
    public static GAME_PANEL:number = Enum.start();
    public static DRAW_PANEL: number = Enum.next();
    public static RULE_PANEL: number = Enum.next();
    public static VOTE_PANEL: number = Enum.next();
    public static VOTE_RESULT_PANEL: number = Enum.next();

    /** 所有面板个数*/
    public static PANEL_NUM:number = Enum.next();
    public static PANEL_CLASS:any[] = [];
    public static init():void
    {
        PanelName.PANEL_CLASS[ PanelName.GAME_PANEL ] = view.Game;
        PanelName.PANEL_CLASS[ PanelName.DRAW_PANEL ] = view.Draw;
        PanelName.PANEL_CLASS[ PanelName.RULE_PANEL ] = view.Rule;
        PanelName.PANEL_CLASS[ PanelName.VOTE_PANEL ] = view.Vote;
        PanelName.PANEL_CLASS[ PanelName.VOTE_RESULT_PANEL ] = view.VoteResult;
    }
}