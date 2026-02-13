
function TampilkanItems(items, container) {
  container.innerHTML = "";

  items.forEach((item) => {
    const card = `
      <li>
        <div class="mx-4 mt-3 w-60 p-2 bg-white rounded-xl border-2">
          <div class="w-[218px] h-[212px] rounded-xl overflow-hidden">
            <img class="object-cover w-full h-full" src="${item.images[0]}" alt="">
          </div>
          <div class="p-2">
            <h2 class="mt-1 font-bold text-base">${item.title}</h2>
            <div class="flex justify-between">
              <p class="mt-1 font-bold text-base text-black">$${item.price}</p>
              <p class="mt-1 font-bold text-sm text-gray-400">Discount ${item.discount_percentage}%</p>
            </div>
            <p class="mt-1 text-sm text-gray-600">${item.shop.name}</p>
            <div class="mt-3">
              <button class="text-white bg-purple-600 px-3 py-1 rounded-md hover:bg-purple-700 text-center add-to-cart" data-id="${item.id}" data-shop-id="${item.shop.id}">Add to Cart</button>
            </div>
          </div>
        </div>
      </li>
    `;
    container.innerHTML += card;
  });

  container.style.display = "grid";

  const addToCartButtons = container.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.getAttribute("data-id");
      const shopId = event.target.getAttribute("data-shop-id");
      const item = items.find(i => i.id == productId && i.shop.id == shopId);

      addToCart(item);
      updateCartQuantity();
    });
  });
}


function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${item.title} added to cart`);
}

function tampilsemuaItems() {
  const originalContainer = document.getElementById("ProductList");
  const allItems = dataProduct.slice(0, 100);
  TampilkanItems(allItems, originalContainer);
}

function search() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
  const originalContainer = document.getElementById("ProductList");

  if (searchInput === "") {
    tampilsemuaItems();
  } else {
    const filteredResults = dataProduct.filter((item) => {
      return item.title.toLowerCase().includes(searchInput);
    });
    const randomFilteredResults = filteredResults.slice(0, 10);
    TampilkanItems(randomFilteredResults, originalContainer);
  }
}

function filterItems(category) {
  const originalContainer = document.getElementById("resultToko");

  if (category === "All") {
    const allItems = dataProduct.slice(0, 10);
    TampilkanItems(allItems, originalContainer);
  } else {
    const filteredResults = dataProduct.filter((item) => {
      return item.shop.name === category;
    });
    const randomFilteredResults = filteredResults.slice(0, 10);
    TampilkanItems(randomFilteredResults, originalContainer);
  }
}

const storeButtons = document.getElementById("storeButtons").querySelectorAll("button");
storeButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    filterItems(category);
  });
});


const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", search);


function displayCartItems() {
  const cartContainer = document.getElementById("cartItemsContainer");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  TampilkanItems(cart, cartContainer);
}

tampilsemuaItems();


displayCartItems();

