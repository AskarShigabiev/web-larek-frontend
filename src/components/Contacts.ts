import {Form} from "./common/Form";
import {IEvents} from "./base/events";

export interface IContactsForm {
    inputEmail: HTMLInputElement;
    inputPhone: HTMLInputElement;
    phone: string;
    email: string;
  }

export class Contacts extends Form<IContactsForm> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    phone: string;
    email: string;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._emailInput = container.querySelector('[name="email"]');
        this._phoneInput = container.querySelector('[name="phone"]');
    }

    set phoneSet(value: string) {
        this._phoneInput.value = value;
    }
    set emailSet(value: string) {
        this._emailInput.value = value;
    }

    getPhone() {
        return this._phoneInput.value; 
    }

    getEmail() {
        return this._emailInput.value; 
    }

    cleanContactInputs() {
        this._phoneInput.value = '';
        this._emailInput.value = '';
    }
}