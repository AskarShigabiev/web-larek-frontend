import './scss/styles.scss';
import {API_URL, CDN_URL} from './utils/constants';
import {WebLarekAPI} from './components/WebLarekAPI';
import {EventEmitter} from "./components/base/events";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {AppState} from './components/AppData';
import {Modal} from './components/common/Modal';
import {Order} from './components/Order';
import {Contacts} from './components/Contacts';
import {Basket} from './components/common/Basket';
import {Card} from './components/Card';
import {Page} from './components/Page';
import {Success} from './components/common/Success';
import {ICardProduct, IOrderForm} from './types';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
export const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// Вспомогательная функция для рендеринга модальных окон
function renderModal(content: HTMLElement) {
    modal.render({ content });
}

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on('catalog:changed', () => {
    page.catalog = appData.catalog.map((item: ICardProduct) => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
        });
    });
});

// Открытие модального окна карточки (с изменением кнопки, если карточка в корзине)
events.on('card:select', (item: ICardProduct) => {
    const isItemInBasket = appData.checkItemInBasket(item);
    const actionType = isItemInBasket ? 'card:remove' : 'card:add';
    const buttonText = isItemInBasket ? 'Удалить' : 'Добавить';

    const card = new Card(
        cloneTemplate(cardPreviewTemplate), { 
            onClick: () => events.emit(actionType, item) 
        }, 
        buttonText
    );

    renderModal(card.render({
        title: item.title,
        image: item.image,
        description: item.description,
        price: item.price,
        category: item.category,
    }));
});

// Открытие модального окна корзины
events.on('basket:open', () => {
    renderModal(basket.render());
});

// Обновление данных корзины
events.on('basket:change', () => {
    basket.setPrice(appData.sumPriceInBasket(), appData.checkPriceOfProducts());
    basket.basketList = appData.basket.map((item: ICardProduct) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item)
        });

        return card.render({
            title: item.title,
            price: item.price
        });
    });
    basket.toggleButton(appData.counterBasket() === 0 || appData.checkPriceOfProducts());
    page.counter = appData.counterBasket();
});

// Открытие модального окна заказа
events.on('order:open', () => {
    renderModal(order.render({
        valid: false,
        errors: []
    }));
    order.valid = appData.validateOrder();
});

// Открытие модального окна контактов
events.on('order:submit', () => {
    renderModal(contacts.render({
        email: '',
        phone: '',
        valid: false,
        errors: []
    }));
    contacts.valid = appData.validateOrder();
});

// Открытие модального окна подтверждения заказа !!!
events.on('success:open', (result: { id: string, total: number }) => {
    events.emit('delete:all');
    success.total = result.total;
    modal.render({
        content: success.render(),
    });// !!!
});

// Если в корзине или поменялись значения
events.on(/^order|contacts\..*:change/, () => {   
    appData.payment = order.payment; 
    appData.address = order.getAddressInputValue();
    appData.email = contacts.getEmail();
    appData.phone = contacts.getPhone();
    contacts.valid = appData.validateOrder();
    order.valid = appData.validateOrder();
});

// Обновления текста кнопки
events.on('card:change', (item: ICardProduct) => {
    const cardElement = document.querySelector(`[data-id="${item.id}"]`);
    if (cardElement) {
        const button = cardElement.querySelector('.card__button') as HTMLButtonElement;
        if (button) {
            button.textContent = item.buttonText;
        }
    }
});

// Добавление карточки в корзину
events.on('card:add', (item: ICardProduct) => {
    if (!appData.checkItemInBasket(item)) {
        appData.addToBasket(item);
        events.emit('basket:change');
        modal.close();

        const updatedItem = { ...item, buttonText: 'Удалить' };
        events.emit('card:change', updatedItem);
    }
});

// Убрать товар из корзины
events.on('card:add', (item: ICardProduct) => {
    if (!appData.checkItemInBasket(item)) {
        appData.addToBasket(item);
        events.emit('basket:change');
        modal.close();

        const updatedItem = { ...item, buttonText: 'Добавить' };
        events.emit('card:change', updatedItem);
    }
});

// Отправка заказа
events.on('contacts:submit', () => {
    api.orderCards(appData.fillOrderInputs())
    .then(result => {
        events.emit('success:open', result);
    })
    .catch(err => {
        console.error(err);
    });
});

// Очистка полей ввода
events.on('delete:all', () => {
    order.cleanOrderSelections();
    contacts.cleanContactInputs();
    appData.cleanAll();
    events.emit('basket:change');
});

// Блокируем прокрутку страницы, если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокируем прокрутку страницы
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getCardList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });