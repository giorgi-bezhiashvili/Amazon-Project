import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSumaary.js";
import { loadProducts } from "../data/products.js";
import { loadCart } from "../data/cart.js";
new Promise((resolve)=>{
    loadProducts(()=>{
        
        resolve()
    })
}).then(()=>{
    return new Promise((resolve)=>{
        loadCart(()=>{
            resolve()
        })
    })
    
}).then(()=>{
    renderOrderSummary()
    renderPaymentSummary()
})
