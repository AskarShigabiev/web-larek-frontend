import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";

interface ISuccess {
    button: HTMLButtonElement;
}

export class Success extends Component<ISuccess> {
    protected _button: HTMLButtonElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        this._button.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(total: number) {
        const textTotal = `Списано ${total} синапсов`;
        this.setText(this._total, textTotal);
    }

    setText(item: HTMLElement, value: string) {
        if (item) {
            item.textContent = value;
        }
    }

    render() {
        return this._total; 
    }
} 