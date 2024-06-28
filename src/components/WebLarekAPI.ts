import {Api, ApiListResponse} from "./base/api";
import {IOrder,ICardProduct,IOrderResult} from "../types";

export interface IWebLarekAPI {
    getCardList: () => Promise<ICardProduct[]>;
    getCardItem: (id: string) => Promise<ICardProduct>;
    orderCards: (order: IOrder) => Promise<IOrderResult>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardList(): Promise<ICardProduct[]> {
        return this.get('/product').then((data: ApiListResponse<ICardProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getCardItem(id: string): Promise<ICardProduct> {
        return this.get(`/product/${id}`).then(
            (item: ICardProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    orderCards(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}