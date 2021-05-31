import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    carItems: CartItem[] = [];
    totalPrice: Subject<number> = new Subject<number>();
    totalQuantity: Subject<number> = new Subject<number>();
    constructor() {}

    addToCart(theCartItem: CartItem): void {
        let alreadyExistsInCart = false;
        let existingCartItem: CartItem;

        if (this.carItems.length > 0) {
            existingCartItem = this.carItems.find(
                (tempCartItem) => tempCartItem.id === theCartItem.id
            );

            alreadyExistsInCart = existingCartItem !== undefined;
        }

        if (alreadyExistsInCart) {
            existingCartItem.quantity++;
        } else {
            this.carItems.push(theCartItem);
        }

        this.computeCartTotals();
    }

    computeCartTotals() {
        let totalPriceValue = 0;
        let totalQuantityValue = 0;

        for (const currentCarItem of this.carItems) {
            totalPriceValue += currentCarItem.quantity * currentCarItem.unitPrice;
            totalQuantityValue += currentCarItem.quantity;
        }

        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);

        this.logCartData(totalPriceValue, totalQuantityValue);
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        for (const tempCarItem of this.carItems) {
            const subTotalPrice = tempCarItem.quantity * tempCarItem.unitPrice;
        }
    }
}
