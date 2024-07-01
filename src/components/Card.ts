import {Component} from "./base/Component";
import {ICardProduct} from "../types";
import {ensureElement} from "../utils/utils";
import {categoryList} from "../utils/constants";

interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export class Card extends Component<ICardProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _categoryList = categoryList;

  constructor(container: HTMLElement, actions?: ICardActions, buttonTextAdded?: string) {
    super(container);

    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLSpanElement>('.card__price', container);

    const buttonElement = container.querySelector<HTMLButtonElement>('.card__button');
    if (buttonElement) {
      this._button = buttonElement;
    }

    const buttonElementText = container.querySelector<HTMLButtonElement>('.card__text');
    if (buttonElementText) {
      this._description = buttonElementText;
    }

    const cardImage = container.querySelector<HTMLImageElement>('.card__image');
    if (cardImage) {
      this._image = cardImage;
    }

    const cardCategory = container.querySelector<HTMLElement>('.card__category');
    if (cardCategory) {
      this._category = cardCategory;
    }

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
    
    if (this._button && buttonTextAdded) {
        this.buttonText = buttonTextAdded;
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set image(value: string) {
    this.setImage(this._image, value, this._title.textContent || '');
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = `card__category card__category_${this._categoryList[value]}`;
  }

  set price(value: number) {
    this.setText(this._price, value === null ? 'Бесценно' : `${value} синапсов`);
    this._button.disabled = value === null;  // Если цена не указана, то кнопка добавления блокируется
  }

  set buttonText(value: string) {
    this.setText(this._button, value);
  }

  set description(value: string | string[]) {
    if (Array.isArray(value)) {
      this._description.innerHTML = '';
      value.forEach(str => {
        const descElement = document.createElement('p');
        this.setText(descElement, str);
        this._description.appendChild(descElement);
      });
    } else {
      this.setText(this._description, value);
    }
  }
}
