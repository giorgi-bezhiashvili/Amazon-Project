import {cart , addToCart} from "../data/cart.js"
import {products} from "../data/products.js"

let productsHtml = "";


products.forEach((product) => {
  productsHtml += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="select">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}" data-product='${JSON.stringify(product)}'>
        Add to Cart
      </button>
    </div>`;
});

document.querySelector(".js-products-grid").innerHTML = productsHtml;



function updateCartQuantity(){
  let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  let fadeOutTimer; // Declare a timer variable to manage the timeout

  button.addEventListener("click", () => {
    const productId = button.dataset.productId;
    const productContainer = button.closest(".product-container");
    const select = productContainer.querySelector(".select");

    // Retrieve the selected quantity
    const selectedQuantity = parseInt(select.value, 10);

    // Add to cart with the selected quantity
    addToCart(productId, selectedQuantity);

    // Update cart quantity display
    updateCartQuantity();

    // Display the "Added to Cart" message
    const addedToCartElement = productContainer.querySelector(".added-to-cart");
    addedToCartElement.style.opacity = "1";
    addedToCartElement.style.transition = "opacity 0.3s ease";

    // Clear and reset fade-out timer for "Added to Cart" message
    if (fadeOutTimer) {
      clearTimeout(fadeOutTimer);
    }

    fadeOutTimer = setTimeout(() => {
      addedToCartElement.style.opacity = "0";
    }, 2000);
  });
});
