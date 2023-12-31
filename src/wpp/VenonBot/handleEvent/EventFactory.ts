import { IActionBot } from "./Interfaces/IActionBot";
import { TaskSchedule } from "./TaskSchedule";
import { UpdatePowerBI } from "./UpdatePowerBi";
import { IParamActions } from "./Interfaces/IParamActions";
import { GetRefreshes } from "./GetPowerBisRefresh";
import { HelpManu } from "./HelpMenu";
import { throttleTime } from "rxjs";
export class EventFactory {
    private readonly actions: Record<string, IActionBot>;

    constructor() {
        this.actions = {
            "!task": new TaskSchedule(),
            "!refresh": new UpdatePowerBI(),
            "!ultatt": new GetRefreshes(),
        };
        this.actions["!help"] = new HelpManu(this.actions)
    }

    factory(message_event: string): IActionBot {
        console.log(message_event);
        if (typeof message_event !== "string") {
            throw new Error('não posso dar cast porque não é uma string');
        }

        const [command, param] = message_event.split(' ');
        const action = this.actions[command];
        if (!this.hasIParamActionsImplementation(action)) return action;
        (action as IParamActions).setparam(param);
        return action; // ou retorne undefined se não encontrar uma correspondência
    }
    private hasIParamActionsImplementation(obj: any): obj is IParamActions {
        return 'setparam' in obj;
        // Replace 'yourInterfaceMethod' with an actual method or property of the interface
    }
}