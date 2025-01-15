import { cart, removeFromCart, updateCartQuantity, saveToStorage } from "../data/cart.js"
import { products } from "../data/products.js"
import { formatCurrency } from "./utils/money.js"

let cartSummaryHTML = ""
const orderSummary = document.querySelector(".js-order-summary")

// Build cart summary
cart.forEach((cartItem) => {
    const productId = cartItem.productId
    const matchingProduct = products.find(product => product.id === productId)

    if (matchingProduct) {
        cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container${matchingProduct.id}">
                <div class="delivery-date">Delivery date: Tuesday, June 21</div>
                <div class="cart-item-details-grid">
                    <img class="product-image" src="${matchingProduct.image}" alt="${matchingProduct.name}">
                    <div class="cart-item-details">
                        <div class="product-name">${matchingProduct.name}</div>
                        <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
                        <div class="product-quantity">
                            <span>
                                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                            </span>
                            <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">Update</span>
                            <input class="quantity-input" type="number" style="display: none;">
                            <span class="save-quantity-link link-primary" style="display: none;">Save</span>
                            <span class="delete-quantity-link link-primary js-delate-link" data-product-id="${matchingProduct.id}">Delete</span>
                        </div>
                    </div>
                    <div class="delivery-options">
                        <div class="delivery-options-title">Choose a delivery option:</div>
                        <div class="delivery-option">
                            <input type="radio" checked class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                            <div>
                                <div class="delivery-option-date">Tuesday, June 21</div>
                                <div class="delivery-option-price">FREE Shipping</div>
                            </div>
                        </div>
                        <div class="delivery-option">
                            <input type="radio" class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                            <div>
                                <div class="delivery-option-date">Wednesday, June 15</div>
                                <div class="delivery-option-price">$4.99 - Shipping</div>
                            </div>
                        </div>
                        <div class="delivery-option">
                            <input type="radio" class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                            <div>
                                <div class="delivery-option-date">Monday, June 13</div>
                                <div class="delivery-option-price">$9.99 - Shipping</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    }
})

// Update the DOM
orderSummary.innerHTML = cartSummaryHTML

// input changes
document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("keydown", function () {
        if (event.key === "Enter"){
        const cartItemContainer = this.closest(".cart-item-container")
        const productId = cartItemContainer.querySelector(".update-quantity-link").dataset.productId
        const cartItem = cart.find(item => item.productId === productId)

        if (cartItem) {
            let newValue = Number(cartItemContainer.querySelector(".quantity-input").value)
            if (newValue >= 1000) {
                alert("You can't order more than 999 items.")
                newValue = 1
            } else if (newValue < 1) {
                alert("Quantity must be at least 1.")
                newValue = cartItem.quantity
            }
            cartItem.quantity = newValue
            saveToStorage()
            cartItemContainer.querySelector(".quantity-label").textContent = newValue
            cartItemContainer.querySelector(".quantity-input").style.display = "none"
            this.style.display = "none"
            cartItemContainer.querySelector(".update-quantity-link").style.display = "initial"
            document.querySelector(".return-to-home-link").innerHTML = `Items ${updateCartQuantity()}`
        }
    }});
});

// delete links
document.querySelectorAll(".js-delate-link").forEach(link => {
    link.addEventListener("click", function () {
        const productId = this.dataset.productId
        removeFromCart(productId)
        document.querySelector(`.js-cart-item-container${productId}`).remove()
        document.querySelector(".return-to-home-link").innerHTML = `Items ${updateCartQuantity()}`
    })
})

//update links
document.querySelectorAll(".update-quantity-link").forEach(link => {
    link.addEventListener("click", function () {
        const cartItemContainer = this.closest(".cart-item-container");
        cartItemContainer.querySelector(".quantity-input").style.display = "initial";
        cartItemContainer.querySelector(".save-quantity-link").style.display = "initial"
        this.style.display = "none"
    })
})

// save links
document.querySelectorAll(".save-quantity-link").forEach(saveElem => {
    saveElem.addEventListener("click", function () {
        const cartItemContainer = this.closest(".cart-item-container")
        const productId = cartItemContainer.querySelector(".update-quantity-link").dataset.productId
        const cartItem = cart.find(item => item.productId === productId)

        if (cartItem) {
            let newValue = Number(cartItemContainer.querySelector(".quantity-input").value)
            if (newValue >= 1000) {
                alert("You can't order more than 999 items.")
                newValue = 1
            } else if (newValue < 1) {
                alert("Quantity must be at least 1.")
                newValue = cartItem.quantity
            }
            cartItem.quantity = newValue;
            saveToStorage()
            cartItemContainer.querySelector(".quantity-label").textContent = newValue
            cartItemContainer.querySelector(".quantity-input").style.display = "none"
            this.style.display = "none"
            cartItemContainer.querySelector(".update-quantity-link").style.display = "initial"
            document.querySelector(".return-to-home-link").innerHTML = `Items ${updateCartQuantity()}`
        }
    })
})

document.querySelector(".return-to-home-link").innerHTML = `Items ${updateCartQuantity()}`

