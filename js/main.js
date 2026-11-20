"use strict";

// Warenkorb und Kategorie
let shoppingCart = loadCartFromStorage();
let selectedCategory = "all";

// Elemente für Suche und Produktanzeige
const searchInput = document.querySelector("#product-search");
const productCountLabel = document.querySelector("#product-count");

const productGrid = document.querySelector("#product-grid");

// Warenkorb-Elemente
const headerCartCount = document.querySelector("#cart-count");
const cartTotalLabel = document.querySelector("#cart-total");
const cartItemsContainer = document.querySelector("#cart-items");
const cartPanelCountLabel = document.querySelector("#cart-panel-count");

// Sortier-Auswahl
const sortDropdown = document.querySelector("#sort-select");

// Warenkorb speichern
function loadCartFromStorage() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("cart")) ?? [];
    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    console.error("Fehler beim Laden des Warenkorbs:", error);
    return [];
  }
}

function saveCartToStorage(cartToSave) {
  if (window.localStorage) {
    localStorage.setItem("cart", JSON.stringify(cartToSave));
  }
}

// Hilfsfunktionen
function updateProductCount(visibleProducts) {
  productCountLabel.textContent =
    visibleProducts.length !== 1
      ? `${visibleProducts.length} Produkte gefunden`
      : `${visibleProducts.length} Produkt gefunden`;
}

function showStatusMessage(messageText, targetContainer) {
  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("cart-empty");
  messageParagraph.textContent = messageText;
  const messageColumn = document.createElement("div");
  messageColumn.classList.add("col-12");
  messageColumn.append(messageParagraph);
  targetContainer.append(messageColumn);
}

function getSortedProducts(productList, sortOrder) {
  const sortedCopy = productList.slice();
  switch (sortOrder) {
    case "price-asc":
      sortedCopy.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sortedCopy.sort((a, b) => b.price - a.price);
      break;
    case "title-asc":
      sortedCopy.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  return sortedCopy;
}

function calculateCartTotal(productsInCart) {
  const totalPrice = productsInCart.reduce(
    (sum, product) => sum + product.price,
    0,
  );
  return `${totalPrice.toFixed(2)} €`;
}

// Produkte anzeigen
function renderProducts(productsToDisplay) {
  productGrid.innerHTML = "";
  updateProductCount(productsToDisplay);
  if (productsToDisplay.length === 0) {
    showStatusMessage("Keine Produkte gefunden.", productGrid);
  }
  productsToDisplay.forEach(function (product) {
    // Bootstrap-Spalte
    const productColumn = document.createElement("div");
    productColumn.classList.add("col-md-4", "mb-4");
    // Produktkarte
    const productCard = document.createElement("article");
    productCard.classList.add("demo-product");
    // Produktbild
    const productImage = document.createElement("img");
    productImage.src = product.thumbnail;
    productImage.alt = product.title;
    productImage.loading = "lazy";
    // Produktinformationen
    const productBody = document.createElement("div");
    productBody.classList.add("demo-product-body");
    // Name und Preis
    const productTitle = document.createElement("h3");
    const productPrice = document.createElement("p");
    // Warenkorb-Button
    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "In den Warenkorb";
    addToCartButton.classList.add("shop-primary", "product-button");
    addToCartButton.type = "button";

    addToCartButton.addEventListener("click", function () {
      shoppingCart.push(product);
      renderCart(shoppingCart);
      saveCartToStorage(shoppingCart);
    });

    productTitle.textContent = product.title;
    productPrice.textContent = `${product.price.toFixed(2)} €`;

    productColumn.appendChild(productCard);
    productCard.appendChild(productImage);
    productCard.appendChild(productBody);
    productBody.append(productTitle, productPrice, addToCartButton);
    productGrid.append(productColumn);
  });
}

// Warenkorb anzeigen
function renderCart(cartProducts) {
  cartItemsContainer.innerHTML = "";

  const uniqueProducts = cartProducts.filter((product, index, products) => {
    return products.findIndex((entry) => entry.id === product.id) === index;
  });

  uniqueProducts.forEach(function (item) {
    const quantity = cartProducts.filter((product) => {
      return product.id === item.id;
    }).length;
    const cartRow = document.createElement("div");
    cartRow.classList.add("cart-item");

    const cartImage = document.createElement("img");
    cartImage.classList.add("cart-item-image");
    cartImage.src = item.thumbnail;

    const cartItemInfo = document.createElement("div");
    cartItemInfo.classList.add("cart-item-info");

    const cartItemName = document.createElement("div");
    const cartItemPrice = document.createElement("div");

    const removeButton = document.createElement("button");
    removeButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
    removeButton.classList.add("cart-remove");
    const itemTotalPrice = document.createElement("span");
    itemTotalPrice.textContent = `${(item.price * quantity).toFixed(2)} €`;
    cartItemName.textContent = item.title;
    cartItemPrice.textContent = `${item.price.toFixed(2)} € pro Stück`;
    const quantityInput = document.createElement("input");
    quantityInput.value = quantity;
    quantityInput.classList.add("cart-quantity");
    quantityInput.readOnly = true;

    const increaseButton = document.createElement("button");
    increaseButton.textContent = "+";
    increaseButton.type = "button";

    const decreaseButton = document.createElement("button");
    decreaseButton.textContent = "−";
    decreaseButton.type = "button";

    cartItemInfo.append(cartItemName, cartItemPrice);
    cartRow.append(
      cartImage,
      cartItemInfo,
      itemTotalPrice,
      decreaseButton,
      quantityInput,
      increaseButton,
      removeButton,
    );
    cartItemsContainer.append(cartRow);

    removeButton.addEventListener("click", function () {
      shoppingCart = shoppingCart.filter(function (product) {
        return product.id !== item.id;
      });
      renderCart(shoppingCart);
      saveCartToStorage(shoppingCart);
    });
    increaseButton.addEventListener("click", function () {
      shoppingCart.push(item);
      renderCart(shoppingCart);
      saveCartToStorage(shoppingCart);
    });
    decreaseButton.addEventListener("click", function () {
      const productIndex = shoppingCart.findIndex(function (product) {
        return item.id === product.id;
      });
      if (productIndex !== -1) {
        shoppingCart.splice(productIndex, 1);
        renderCart(shoppingCart);
        saveCartToStorage(shoppingCart);
      }
    });
  });
  if (uniqueProducts.length > 2) {
    const clearCartButton = document.createElement("button");
    clearCartButton.innerHTML =
      "<i class='fa-solid fa-trash'></i> Alle löschen";
    clearCartButton.classList.add("remove-all");
    cartItemsContainer.append(clearCartButton);
    clearCartButton.addEventListener("click", function () {
      shoppingCart.splice(0, shoppingCart.length);
      renderCart(shoppingCart);
      saveCartToStorage(shoppingCart);
    });
  }
  if (cartProducts.length === 0) {
    showStatusMessage("Dein Warenkorb ist noch leer.", cartItemsContainer);
  }
  headerCartCount.textContent = cartPanelCountLabel.textContent =
    shoppingCart.length;
  cartTotalLabel.textContent = calculateCartTotal(shoppingCart);
}

// Produkte filtern und sortieren
function updateVisibleProducts(products) {
  const filteredProducts = products.filter(function (product) {
    return selectedCategory === "all" || product.category === selectedCategory;
  });
  const searchedProducts = filteredProducts.filter(function (product) {
    return product.title
      .toLowerCase()
      .includes(searchInput.value.trim().toLowerCase());
  });
  const sortedProducts = getSortedProducts(
    searchedProducts,
    sortDropdown.value,
  );
  renderProducts(sortedProducts);
}

// Eingaben verarbeiten
function setupSearchListener(products) {
  searchInput.addEventListener("input", function () {
    updateVisibleProducts(products);
  });
}

function setupSortListener(products) {
  sortDropdown.addEventListener("change", function () {
    updateVisibleProducts(products);
  });
}

function setupCategoryListener(allProducts) {
  const categoryButtons = document.querySelectorAll(
    "#category-filters .category-button",
  );

  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      categoryButtons.forEach(function (categoryButton) {
        categoryButton.classList.remove("is-active");
        categoryButton.setAttribute("aria-pressed", "false");
      });
      this.classList.add("is-active");
      this.setAttribute("aria-pressed", "true");
      selectedCategory = this.dataset.category;
      updateVisibleProducts(allProducts);
    });
  });
}

// Produkte laden
function loadProductsFromJson() {
  const request = new XMLHttpRequest();
  request.onload = function () {
    if (request.status === 200 && Array.isArray(request.response)) {
      const loadedProducts = request.response;
      shoppingCart.forEach(function (cartProduct) {
        const currentProduct = loadedProducts.find(function (product) {
          return product.id === cartProduct.id;
        });
        if (currentProduct) {
          cartProduct.thumbnail = currentProduct.thumbnail;
        }
      });
      saveCartToStorage(shoppingCart);
      renderCart(shoppingCart);
      setupSearchListener(loadedProducts);
      updateVisibleProducts(loadedProducts);
      setupSortListener(loadedProducts);
      setupCategoryListener(loadedProducts);
    } else {
      productGrid.innerHTML = "";
      showStatusMessage("Produkte konnten nicht geladen werden.", productGrid);
    }
  };
  request.onerror = function () {
    productGrid.innerHTML = "";
    showStatusMessage(
      "Netzwerkfehler. Bitte versuche es später erneut.",
      productGrid,
    );
  };
  request.open("GET", "data/products.json");
  request.responseType = "json";
  showStatusMessage("Produkte werden geladen ...", productGrid);
  request.send();
}

// Start
renderCart(shoppingCart);
loadProductsFromJson();
