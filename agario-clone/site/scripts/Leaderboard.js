export class Leaderboard {
    constructor() {
        this.htmlElementId = "#l_players";
        this.attrDataId = "id";
        this.attrDataScore = "score";
        this.$list = $(this.htmlElementId);
    }
    static get Instance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new this();
        console.log("Leaderboard initialized.");
        return this.instance;
    }
    get DataElements() {
        return this.$list.children();
    }
    Initialize(playersData) {
        this.Clear();
        this.FillListWithData(playersData.sort((a, b) => b.score - a.score));
    }
    Clear() {
        this.DataElements.remove();
    }
    AppendNewDataToList(playerData) {
        return $(`<li data-${this.attrDataId}="${playerData.id}" data-${this.attrDataScore}="${playerData.score}">${playerData.nickname}</li>`)
            .appendTo(this.$list);
    }
    FillListWithData(playerData) {
        playerData.forEach((data) => this.AppendNewDataToList(data));
    }
    FindElementByPlayerId(playerId) {
        return this.$list.find(`[data-${this.attrDataId}='${playerId}']`);
    }
    FindElementByIndex(index) {
        return this.DataElements.eq(index);
    }
    SetNewPosition(element) {
        let index = this.DataElements.length;
        let elementScore = element.data(this.attrDataScore);
        for (let e of this.DataElements) {
            if (e.dataset[this.attrDataScore] <= elementScore) {
                index = this.FindElementByPlayerId(e.dataset[this.attrDataId]).index();
                break;
            }
        }
        this.FindElementByIndex(index).before(element);
        return index;
    }
    AddNewPlayer(playerData) {
        this.AppendNewDataToList(playerData);
    }
    AddLocalPlayer(playerData) {
        this.AppendNewDataToList(playerData).addClass("li_local");
        this.UpdatePlayer(playerData);
    }
    UpdatePlayer(playerData) {
        let element = this.FindElementByPlayerId(playerData.id);
        element.attr(`data-${this.attrDataScore}`, playerData.score)
            .data(this.attrDataScore, playerData.score);
        this.TryUpdateLocalPlayer(element, this.SetNewPosition(element), playerData.nickname);
    }
    TryUpdateLocalPlayer(element, index, nickname) {
        if (element.hasClass("li_local")) {
            element.text(`${index + 1}. ${nickname}`);
        }
    }
    RemovePlayer(playerId) {
        this.FindElementByPlayerId(playerId).remove();
    }
}
Leaderboard.instance = null;
