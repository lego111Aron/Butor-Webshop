import { ShoppingCart } from "./ShoppingCart";

export interface PurchaseHistory {
    itemId: number;
    shoppingCart: ShoppingCart[];
    purchaseDate: Date;
}