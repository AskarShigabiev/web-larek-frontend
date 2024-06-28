import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";


export class Order extends Form<IOrderForm> {
    protected _paymentCardButton: HTMLButtonElement;
    protected _paymentCashButton: HTMLButtonElement;
    protected _button: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;
    payment: string = '';

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

        this._paymentCardButton = container.querySelector('button[name="card"]');
        this._paymentCashButton = container.querySelector('button[name="cash"]');
        this._addressInput = container.querySelector('input[name="address"]');
        this._button = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
   
        this.payment = '';

        if (this._addressInput) {
            this._addressInput.addEventListener('input', () => {
                this.onInputChange('address');
            });
        }

        if (this._paymentCardButton) {
            this._paymentCardButton.addEventListener('click', () => {
                this.payment = 'online';
                this._paymentCardButton.classList.add('button_alt-active');
                if (this._paymentCashButton) {
                    this._paymentCashButton.classList.remove('button_alt-active');
                }
                this.onInputChange('payment');
            });
        }

        if (this._paymentCashButton) {
            this._paymentCashButton.addEventListener('click', () => {
                this.payment = 'cash';
                if (this._paymentCardButton) {
                    this._paymentCardButton.classList.remove('button_alt-active');
                }
                this._paymentCashButton.classList.add('button_alt-active');
                this.onInputChange('payment');
            });
        }

        this.onInputChange = (field: keyof IOrderForm) => {
            super.onInputChange(field);
        
            if (this._addressInput && this.payment) {
                if (this._addressInput.value.trim() && this.payment) {
                    this._button.removeAttribute('disabled');
                } else {
                    this._button.setAttribute('disabled', 'true');
                }
            }
        }
	}  

    getAddressInputValue() {
        return this._addressInput ? this._addressInput.value : '';
    }

    cleanOrderSelections() {
        if (this._paymentCardButton) {
            this._paymentCardButton.classList.remove('button_alt-active');
        }
        if (this._paymentCashButton) {
            this._paymentCashButton.classList.remove('button_alt-active');
        }
        if (this._addressInput) {
            this._addressInput.value = '';
        }
        this.payment = '';
    }
}
