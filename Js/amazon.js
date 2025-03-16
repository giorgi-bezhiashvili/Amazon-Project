import { cart, addToCart, updateCartQuantity } from "../data/cart.js";
import { products , loadProducts} from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let productsHtml = "";

loadProducts(renderProductsGrid)

function renderProductsGrid(){

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
        <img class="product-rating-stars" src="${product.getStarsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
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

      ${product.extraInfoHTML()}

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

updateCartQuantity();

document.querySelector(".js-cart-quantity").innerHTML = updateCartQuantity();

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
    document.querySelector(".js-cart-quantity").innerHTML = updateCartQuantity();

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
})
}
