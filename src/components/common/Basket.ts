import {Component} from "../base/Component";
import {createElement, ensureAllElements, ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";

interface IBasketView {
    basketList: HTMLElement,
    button: HTMLButtonElement,
    total:  HTMLElement;
}

export class Basket extends Component<IBasketView> {
	protected _basketList: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._basketList = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);

		this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

		this.basketList = [];
	}

    toggleButton(state: boolean) {
        this.setDisabled(this._button, state);
    }

    set basketList(items: HTMLElement[]) {
        if (items.length) {
        this._basketList.innerHTML = '';
        this._basketList.replaceChildren(...items);
        } else {
            this._basketList.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                  textContent: 'Корзина пуста',
                })
            )
        }
        const itemIndexElements: HTMLElement[] = ensureAllElements<HTMLElement>('.basket__item-index', this._basketList);
        itemIndexElements.forEach((element, index) => {
            element.textContent = String(index + 1);
        });
    }

    setPrice(total: number, priceless: boolean,) {
        const priceText = priceless ? 'Бесценно' : `${total} синапсов`;
        this.setText(this._total, priceText);
    }
}