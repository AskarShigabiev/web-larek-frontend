import {Model} from "./base/Model";
import {ICardProduct, IAppState} from "../types";

interface IAppStateProperties {
    catalog: ICardProduct[];
    basket: ICardProduct[];
    preview: ICardProduct | null;
    address: string;
    payment: string;
    email: string;
    phone: string;
}

export class AppState extends Model<IAppState> implements IAppStateProperties {
    catalog: ICardProduct[] = [];
    basket: ICardProduct[] = [];
    preview: ICardProduct | null = null;
    address: string = '';
    payment: string = '';
    email: string = '';
    phone: string = '';

    setCatalog(itemList: ICardProduct[]) {
        this.catalog = itemList;
        this.emitChanges('catalog:changed', { catalog: this.catalog });
    }

    addToBasket(item: ICardProduct) {
        this.basket.push(item);
        this.emitChanges('basket:change');
    }

    removeFromBasket(item: ICardProduct) {
        this.basket = this.basket.filter(product => product.id !== item.id);
        this.emitChanges('basket:change');
    }
    
    sumPriceInBasket() {
        return this.basket.reduce((sum, current) => sum + (current.price || 0), 0);
    }    

    checkItemInBasket(item: ICardProduct) {
        return this.basket.some(product => product.id === item.id);
    }
    
    checkPriceOfProducts() {
        return this.basket.some(({ price }) => price === null);
    }

    counterBasket() {
        return this.basket.length;
    }

    paymentSelect(buttonContent: string) {
        if(buttonContent === 'Онлайн') {
            this.payment = 'online';
        }
        if(buttonContent === 'При получении') {
            this.payment = 'offline';
        }
    }

    validateOrder() {
        // Проверяем, что в корзине есть товары
        if (this.basket.length === 0) {
            return false;
        }
        // Проверяем, что указаны адрес и способ оплаты
        if (this.address.length === 0 || this.payment.length === 0) {
            return false;
        }
        // Проверяем, что указаны контактные данные (email и телефон)
        if (this.email.length === 0 || this.phone.length === 0) {
            return false;
        }
        // Все условия выполнены, заказ может быть оформлен
        return true;
    }

    fillOrderInputs() {
        return {
            total: this.sumPriceInBasket(),
            items: this.basket.map(element => element.id),
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    cleanAll() {
        this.payment = "";
        this.address = "";
        this.email = "";
        this.phone = "";
        this.basket = [];
        this.preview = null;
    }
}