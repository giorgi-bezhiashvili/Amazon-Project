import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSumaary.js";
import { loadProductsFetch} from "../data/products.js";
import { loadCart } from "../data/cart.js";

async function loadPage(){
    
    await loadProductsFetch()

    const calue =await new Promise(resolve => {
        loadCart(() => {
            resolve();
        });
    })

    renderOrderSummary()
    renderPaymentSummary()
}
loadPage()
