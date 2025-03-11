import { cart, removeFromCart, updateCartQuantity, saveToStorage, udpateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSumaary.js";

const today = dayjs();
const deliveryDate = today.add(7, "day");


export function renderOrderSummary(){

let cartSummaryHTML = "";
const orderSummary = document.querySelector(".js-order-summary");



// Build cart summary
cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = products.find(product => product.id === productId);

    if (matchingProduct) {
        const deliveryOptionId = cartItem.deliveryOptionId;
        let selectedDeliveryOption;

        deliveryOption.forEach((option) => {
            if (option.id === deliveryOptionId) {
                selectedDeliveryOption = option;
            }
        });

        if (selectedDeliveryOption) {
            const today = dayjs();
            const deliveryDate = today.add(selectedDeliveryOption.deliveryDays, "days");
            const dateString = deliveryDate.format("dddd, MMMM D");

            cartSummaryHTML += `
                <div class="cart-item-container js-cart-item-container${matchingProduct.id}">
                    <div class="delivery-date">Delivery date: ${dateString}</div>
                    <div class="cart-item-details-grid">
                        <img class="product-image" src="${matchingProduct.image}" alt="${matchingProduct.name}">
                        <div class="cart-item-details">
                            <div class="product-name">${matchingProduct.name}</div>
                            <div class="product-price">${matchingProduct.getPrice()}</div>
                            <div class="product-quantity">
                                <span>
                                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                                </span>
                                <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">Update</span>
                                <input class="quantity-input" type="number" style="display: none;">
                                <span class="save-quantity-link link-primary" style="display: none;">Save</span>
                                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
                            </div>
                        </div>
                        <div class="delivery-options">
                            <div class="delivery-options-title">Choose a delivery option:</div>
                            ${deliveryOptionsHTML(matchingProduct, cartItem)}
                        </div>
                    </div>
                </div>`;
        }
    }
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOption.forEach(option => {
        const today = dayjs();
        const deliveryDate = today.add(option.deliveryDays, "days");
        const dateString = deliveryDate.format("dddd, MMMM D");
        const priceString = option.priceCents === 0 
            ? "FREE" 
            : `$${formatCurrency(option.priceCents)} -`;
        const isChecked = option.id === cartItem.deliveryOptionId;

        html += `
            <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${option.id}">
                <input 
                    type="radio" 
                    ${isChecked ? `checked` : ""} 
                    class="delivery-option-input" 
                    name="delivery-option-${matchingProduct.id}" 
                    value="${option.id}">
                <div>
                    <div class="delivery-option-date">${dateString}</div>
                    <div class="delivery-option-price">${priceString} Shipping</div>
                </div>
            </div>`;
    });

    return html;
}

// Update the DOM
orderSummary.innerHTML = cartSummaryHTML;

// Event listener for quantity input changes
document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const cartItemContainer = this.closest(".cart-item-container");
            const productId = cartItemContainer.querySelector(".update-quantity-link").dataset.productId;
            const cartItem = cart.find(item => item.productId === productId);

            if (cartItem) {
                let newValue = Number(cartItemContainer.querySelector(".quantity-input").value);
                if (newValue >= 1000) {
                    alert("You can't order more than 999 items.");
                    newValue = 1;
                } else if (newValue < 1) {
                    alert("Quantity must be at least 1.");
                    newValue = cartItem.quantity;
                }
                cartItem.quantity = newValue;
                saveToStorage();
                cartItemContainer.querySelector(".quantity-label").textContent = newValue;
                cartItemContainer.querySelector(".quantity-input").style.display = "none";
                this.style.display = "none";
                cartItemContainer.querySelector(".update-quantity-link").style.display = "initial";
                document.querySelector(".return-to-home-link").innerHTML = `Items ${updateCartQuantity()}`;
            }
        }
    });
});

// Event listener for delete links
document.querySelectorAll(".js-delete-link").forEach(link => {
    link.addEventListener("click", function () {
        const productId = this.dataset.productId;
        removeFromCart(productId);
        document.querySelector(`.js-cart-item-container${productId}`).remove();
        document.querySelector(".return-to-home-link").innerHTML = `Items ${updateCartQuantity()}`;
        renderPaymentSummary()
    });
});

// Event listener for update links
document.querySelectorAll(".update-quantity-link").forEach(link => {
    link.addEventListener("click", function () {
        const cartItemContainer = this.closest(".cart-item-container");
        cartItemContainer.querySelector(".quantity-input").style.display = "initial";
        cartItemContainer.querySelector(".save-quantity-link").style.display = "initial";
        this.style.display = "none";
    });
});

// Event listener for save links
document.querySelectorAll(".save-quantity-link").forEach(saveElem => {
    saveElem.addEventListener("click", function () {
        const cartItemContainer = this.closest(".cart-item-container");
        const productId = cartItemContainer.querySelector(".update-quantity-link").dataset.productId;
        const cartItem = cart.find(item => item.productId === productId);

        if (cartItem) {
            let newValue = Number(cartItemContainer.querySelector(".quantity-input").value);
            if (newValue >= 1000) {
                alert("You can't order more than 999 items.");
                newValue = 1;
            } else if (newValue < 1) {
                alert("Quantity must be at least 1.");
                newValue = cartItem.quantity;
            }
            cartItem.quantity = newValue;
            saveToStorage();
            cartItemContainer.querySelector(".quantity-label").textContent = newValue;
            cartItemContainer.querySelector(".quantity-input").style.display = "none";
            this.style.display = "none";
            cartItemContainer.querySelector(".update-quantity-link").style.display = "initial";
            document.querySelector(".return-to-home-link").innerHTML = `Items ${updateCartQuantity()}`;
        }
        renderPaymentSummary()
    });
});

document.querySelectorAll(".js-delivery-option").forEach(element => {
    element.addEventListener("click", function () {
        const { productId, deliveryOptionId } = this.dataset;
        udpateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary()  
        renderPaymentSummary()
      
    });
});

// Update cart summary initially
document.querySelector(".return-to-home-link").innerHTML = `Items ${updateCartQuantity()}`
}
renderOrderSummary()
