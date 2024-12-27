import { Player, LocalPlayer } from './@imports.js';
import { ServerDataSchemas } from './client_server/index.js';

export class Leaderboard
{
    private static instance: Leaderboard = null;

    private readonly htmlElementId: string = "#l_players";
    private readonly attrDataId: string = "id";
    private readonly attrDataScore: string = "score";
    private readonly $list = $(this.htmlElementId);

    private constructor()
    {
    }

    public static get Instance(): Leaderboard
    {
        if (this.instance)
        {
            return this.instance;
        }

        this.instance = new this();

        console.log("Leaderboard initialized.");
        return this.instance;
    }

    private get DataElements()
    {
        return this.$list.children();
    }

    public Initialize(playersData: Array<ServerDataSchemas.IPlayerLedearboard>): void
    {
        this.Clear();
        this.FillListWithData(playersData.sort((a, b) => b.score - a.score));
    }

    public Clear(): void
    {
        this.DataElements.remove();
    }

    private AppendNewDataToList(playerData: ServerDataSchemas.IPlayerLedearboard): JQuery<HTMLElement>
    {
        return $(`<li data-${this.attrDataId}="${playerData.id}" data-${this.attrDataScore}="${playerData.score}">${playerData.nickname}</li>`)
            .appendTo(this.$list);
    }

    private FillListWithData(playerData: Array<ServerDataSchemas.IPlayerLedearboard>): void
    {
        playerData.forEach((data) => this.AppendNewDataToList(data));
    }

    private FindElementByPlayerId (playerId: string)
    {
        return this.$list.find(`[data-${this.attrDataId}='${playerId}']`);
    }

    private FindElementByIndex (index: number)
    {
        return this.DataElements.eq(index);
    }

    private SetNewPosition(element: JQuery<HTMLElement>): number
    {
        let index = this.DataElements.length;
        let elementScore = element.data(this.attrDataScore);

        for (let e of this.DataElements)
        {
            if (e.dataset[this.attrDataScore] <= elementScore)
            {
                index = this.FindElementByPlayerId(e.dataset[this.attrDataId]).index();
                break;
            }
        }

        this.FindElementByIndex(index).before(element);
        return index;
    }

    public AddNewPlayer(playerData: ServerDataSchemas.IPlayerLedearboard): void
    {
        this.AppendNewDataToList(playerData);
    }

    public AddLocalPlayer(playerData: ServerDataSchemas.IPlayerLedearboard): void
    {
        this.AppendNewDataToList(playerData).addClass("li_local");
        this.UpdatePlayer(playerData);
    }

    public UpdatePlayer(playerData: ServerDataSchemas.IPlayerLedearboard): void
    {   
        let element = this.FindElementByPlayerId(playerData.id);

        element.attr(`data-${this.attrDataScore}`, playerData.score)
            .data(this.attrDataScore, playerData.score);

        this.TryUpdateLocalPlayer(element, this.SetNewPosition(element), playerData.nickname);
    }

    private TryUpdateLocalPlayer(element: JQuery<HTMLElement>, index: number, nickname: string): void
    {
        if (element.hasClass("li_local"))
        {
            element.text(`${index + 1}. ${nickname}`);
        }
    }

    public RemovePlayer(playerId: string): void
    {
        this.FindElementByPlayerId(playerId).remove();
    }
}