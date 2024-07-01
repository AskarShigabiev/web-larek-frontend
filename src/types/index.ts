export interface ICardProduct {
    id: string;
    image: string;
    price: number | null;
    category: string;
    description: string;
	title: string;
	buttonText?: string;
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;
}

export interface IOrderForm {
	payment: string;
	addressInput: HTMLInputElement;
	paymentCardButton: HTMLButtonElement;
    paymentCashButton: HTMLButtonElement;
	address: string;
}

export interface IOrderResult {
	id: string;
	total: number;
}
  
export interface IAppState {
	catalog: ICardProduct[];
	basket: ICardProduct[];
	preview: ICardProduct | null;
	order: IOrder;
}
