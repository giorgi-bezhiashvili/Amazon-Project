export const cart = [];

export function addToCart(productId, selectedQuantity) {
    let matchingItem;
  
    cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
  
    if (matchingItem) {
      matchingItem.quantity += selectedQuantity;
    } else {
      cart.push({
        productId: productId,
        quantity: selectedQuantity,
      });
    }
  }
  
