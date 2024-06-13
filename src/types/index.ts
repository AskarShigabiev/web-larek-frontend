type payment = "Онлайн | При получении"
type cardPreview = Pick<Card, "categoty" | "name" | "text" | "price">;
type basketList = Pick<Card, "id" | "name" | "price">;

interface Card {
    id: string;
    name: string;
    text: string;
    link: string;
    price: number | null;
    categoty: string;
}

interface CardList {
    total: number;
    cards: Card[];
}

interface UserContacts {
    adress: string;
    email: string;
    phone: string;
}

interface Basket {
    items: Map<string, number>;
    sum: number;
}
