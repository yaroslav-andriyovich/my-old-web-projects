import { Server, MouseControl, KeyControl } from './@imports.js';
import { ServerDataSchemas } from './client_server/index.js';

export class Menu
{
    private static instance: Menu = null;

    private server: Server;

    private panel = $("#menu");
    private panelBackground = $("#menu_background");
    private nameField = $("#set_name");
    private textError = $("#nickname_error");
    private buttonStartGame = $("#start_game");
    private textScore = $("#score");
    private enteredNickname = "";
    private textServerConnectionState = $("#server_indicator");
    private roomInfo = $("#room_info");

    private constructor()
    {
    }

    public static get Instance(): Menu
    {
        if (this.instance)
        {
            return this.instance;
        }

        this.instance = new this();
        this.instance.buttonStartGame.click( () => this.instance.OnStartGameButtonClick());

        console.log("Menu initialized.");
        return this.instance;
    }

    public Show(showWithBackground: boolean = false): void
    {
        this.panel.fadeIn(150);
        this.textScore.hide();

        KeyControl.exitKeyControl();
        MouseControl.exitMouseControl();

        if (showWithBackground)
            this.panelBackground.show();
        else
            this.panelBackground.hide();
    }

    public Hide(hideWithBackground: boolean = false): void
    {
        this.panel.fadeOut(150);
        this.textScore.show();

        KeyControl.initControl();
        MouseControl.initMouseControl();

        if (hideWithBackground)
            this.panelBackground.hide();
    }

    public UpdateScore(value: number): void
    {
        this.textScore.text(`Score: ${Math.round(value)}`);
    }

    private NicknameIsIncorrect(): boolean
    {
        let name: string = this.nameField.val().toString();
        name = name.replace(/\s/g, ' ');
        
        if (!name)
        {
            console.warn("Name has not been entered.");
        }
        else if (name.length < 3 || name.length > 20)
        {
            this.textError.show();
            return true;
        }

        this.textError.hide();
        this.enteredNickname = name;
    }

    public OnServerConnected(): void
    {
        this.textServerConnectionState.text("Connected").css("color", "#00ff37");
    }

    public OnServerDisconnected(): void
    {
        this.textServerConnectionState.text("Disconnected").css("color", "#ff0000");
        this.ResetOnline();
        this.Show(true);
    }

    public UpdateOnline(data: ServerDataSchemas.UpdateOnline): void
    {
        this.roomInfo.text(`Current online: ${data.online}`);
    }

    public ResetOnline(): void
    {
        this.roomInfo.text("");
    }

    private OnStartGameButtonClick(): void
    {
        if(!Server.Instance.ConnectionState) 
        {
            alert("Server connection error.");
            // Прекратить процедуру спавна
            return;
        }

        if (this.NicknameIsIncorrect())
        {
            // Прекратить процедуру спавна
            return;
        }

        Server.Instance.RPC_ReadyToSpawn(this.enteredNickname);
    }
}