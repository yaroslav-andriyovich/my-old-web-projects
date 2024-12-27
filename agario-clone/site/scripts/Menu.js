import { Server, MouseControl, KeyControl } from './@imports.js';
export class Menu {
    constructor() {
        this.panel = $("#menu");
        this.panelBackground = $("#menu_background");
        this.nameField = $("#set_name");
        this.textError = $("#nickname_error");
        this.buttonStartGame = $("#start_game");
        this.textScore = $("#score");
        this.enteredNickname = "";
        this.textServerConnectionState = $("#server_indicator");
        this.roomInfo = $("#room_info");
    }
    static get Instance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new this();
        this.instance.buttonStartGame.click(() => this.instance.OnStartGameButtonClick());
        console.log("Menu initialized.");
        return this.instance;
    }
    Show(showWithBackground = false) {
        this.panel.fadeIn(150);
        this.textScore.hide();
        KeyControl.exitKeyControl();
        MouseControl.exitMouseControl();
        if (showWithBackground)
            this.panelBackground.show();
        else
            this.panelBackground.hide();
    }
    Hide(hideWithBackground = false) {
        this.panel.fadeOut(150);
        this.textScore.show();
        KeyControl.initControl();
        MouseControl.initMouseControl();
        if (hideWithBackground)
            this.panelBackground.hide();
    }
    UpdateScore(value) {
        this.textScore.text(`Score: ${Math.round(value)}`);
    }
    NicknameIsIncorrect() {
        let name = this.nameField.val().toString();
        name = name.replace(/\s/g, ' ');
        if (!name) {
            console.warn("Name has not been entered.");
        }
        else if (name.length < 3 || name.length > 20) {
            this.textError.show();
            return true;
        }
        this.textError.hide();
        this.enteredNickname = name;
    }
    OnServerConnected() {
        this.textServerConnectionState.text("Connected").css("color", "#00ff37");
    }
    OnServerDisconnected() {
        this.textServerConnectionState.text("Disconnected").css("color", "#ff0000");
        this.ResetOnline();
        this.Show(true);
    }
    UpdateOnline(data) {
        this.roomInfo.text(`Current online: ${data.online}`);
    }
    ResetOnline() {
        this.roomInfo.text("");
    }
    OnStartGameButtonClick() {
        if (!Server.Instance.ConnectionState) {
            alert("Server connection error.");
            return;
        }
        if (this.NicknameIsIncorrect()) {
            return;
        }
        Server.Instance.RPC_ReadyToSpawn(this.enteredNickname);
    }
}
Menu.instance = null;
