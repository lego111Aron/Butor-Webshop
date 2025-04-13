import { ShoppingCart } from "./ShoppingCart";
import { PurchaseHistory } from "./PurchaseHistory";

export interface User {
    userId: number;
    name: string;
    streetAndHouseNumber: string;
    email: string;
    zipCode: number;
    password: string;
    userRole: string;
    shoppingCart: ShoppingCart[];
    purchaseHistory: PurchaseHistory[];
}