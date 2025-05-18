import { ShoppingCart } from "./ShoppingCart";
import { PurchaseHistory } from "./PurchaseHistory";

export interface User {
    userId: string;
    name: string;
    streetAndHouseNumber: string;
    email: string;
    zipCode: number;
    userRole: string;
    shoppingCart: ShoppingCart[];
    purchaseHistory: PurchaseHistory[];
    // password: string;
}