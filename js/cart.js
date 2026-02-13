const cartContainer = document.getElementById("cartItemsContainer");

function addItemWithSameShop(item) {
  const tokoElement = document.querySelector(`.toko-name-${item.shop.id}`);
  const newItemElement = document.createElement("div");
  newItemElement.classList.add("flex", "mb-4", "item-row");

  newItemElement.innerHTML = `
      <input type="checkbox" class="form-checkbox h-5 w-5 bg-purple-600 mt-0 ml-6 item-checkbox" onclick="updateSelectedCount()" data-id="${item.id}" />
      <div class="ml-3 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mt-1">
        <img src="${item.images[0]}" alt="product" class="object-cover w-full h-full" />
      </div>
      <div class="ml-4 flex-1">
        <p class="font-semibold text-gray-800">${item.title}</p>
        <p class="text-gray-600">${item.description}</p>
        <div class="flex justify-between items-center mt-2">
          <div>
            <span class="text-red-500 font-semibold harga">$${item.price}</span>
            <span class="text-gray-500 text-xs">Discount ${item.discount_percentage}%</span>
          </div>
          <div class="flex items-center">
            <button type="button" class="text-gray-500 hover:text-gray-700 mr-2" onclick="toggleNoteInput(this)"><i class="bx bx-notepad"></i></button>
            <button type="button" class="text-gray-500 hover:text-gray-700 mr-5 delete-item" data-id="${item.id}" onclick="deleteItem(this)"><i class="bx bx-trash"></i></button>
            <button type="button" class="text-gray-500 hover:text-gray-700" onclick="changeQuantity(this, -1)"><i class="bx bx-minus"></i></button>
            <span class="mx-2 quantity">1</span>
            <button type="button" class="text-gray-500 hover:text-gray-700" onclick="changeQuantity(this, 1)"><i class="bx bx-plus"></i></button>
          </div>
        </div>
        <div class="note-input mt-2 hidden">
          <input type="text" class="w-full p-2 border rounded" placeholder="Masukkan catatan" />
        </div>
      </div>
    `;

  tokoElement.appendChild(newItemElement);
}

function addItemWithDifferentShop(item) {
  const newItemElement = document.createElement("div");
  newItemElement.classList.add("cart-item");

  newItemElement.innerHTML = `
      <div class="border-t border-gray-400 pt-4 pb-4 toko toko-name-${item.shop.id}">
        <div class="flex items-center mb-4">
          <input type="checkbox" class="form-checkbox h-5 w-5 bg-purple-600 toko-checkbox" onclick="toggleTokoItems(this)" />
          <span class="ml-2 font-semibold text-gray-700">${item.shop.name}</span>
        </div>
        <div class="flex mb-4 item-row">
          <input type="checkbox" class="form-checkbox h-5 w-5 bg-purple-600 mt-0 ml-6 item-checkbox" onclick="updateSelectedCount()" data-id="${item.id}" />
          <div class="ml-3 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mt-1">
            <img src="${item.images[0]}" alt="product" class="object-cover w-full h-full" />
          </div>
          <div class="ml-4 flex-1">
            <p class="font-semibold text-gray-800">${item.title}</p>
            <p class="text-gray-600">${item.description}</p>
            <div class="flex justify-between items-center mt-2">
              <div>
                <span class="text-red-500 font-semibold harga">$${item.price}</span>
                <span class="text-gray-500 text-xs">Discount ${item.discount_percentage}%</span>
              </div>
              <div class="flex items-center">
                <button type="button" class="text-gray-500 hover:text-gray-700 mr-2" onclick="toggleNoteInput(this)"><i class="bx bx-notepad"></i></button>
                <button type="button" class="text-gray-500 hover:text-gray-700 mr-5 delete-item" data-id="${item.id}" onclick="deleteItem(this)"><i class="bx bx-trash"></i></button>
                <button type="button" class="text-gray-500 hover:text-gray-700" onclick="changeQuantity(this, -1)"><i class="bx bx-minus"></i></button>
                <span class="mx-2 quantity">1</span>
                <button type="button" class="text-gray-500 hover:text-gray-700" onclick="changeQuantity(this, 1)"><i class="bx bx-plus"></i></button>
              </div>
            </div>
            <div class="note-input mt-2 hidden">
              <input type="text" class="w-full p-2 border rounded" placeholder="Masukkan catatan" />
            </div>
          </div>
        </div>
      </div>
    `;

  cartContainer.appendChild(newItemElement);
}

cartContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-item")) {
    const itemId = event.target.getAttribute("data-id");
    removeItemFromCart(itemId);
  }
}); 

function removeItemFromCart(itemId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id != itemId);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function displayCartItems() {
  cartContainer.innerHTML = "";

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Keranjang belanja Anda kosong</p>";
    return;
  }

  cart.forEach((item) => {
    const existingTokoElement = document.querySelector(`.toko-name-${item.shop.id}`);
    if (existingTokoElement) {
      addItemWithSameShop(item);
    } else {
      addItemWithDifferentShop(item);
    }
  });
}


function toggleSelectAll(source) {
  const allCheckboxes = document.querySelectorAll(".item-checkbox, .toko-checkbox");
  allCheckboxes.forEach((checkbox) => {
    checkbox.checked = source.checked;
  });
  updateSelectedCount();
}

function toggleTokoItems(source) {
  const itemRows = source.closest(".toko").querySelectorAll(".item-checkbox");
  itemRows.forEach((checkbox) => {
    checkbox.checked = source.checked;
  });
  updateSelectedCount();
}

function updateSelectedCount() {
  const checkboxes = document.getElementsByClassName("item-checkbox");
  let count = 0;
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      count++;
    }
  }
  document.getElementById("selectedCount").innerText = count;

  const allCheckboxes = document.querySelectorAll(".item-checkbox, .toko-checkbox");
  const allChecked = Array.from(allCheckboxes).every((checkbox) => checkbox.checked);
  document.getElementById("selectAll").checked = allChecked;
  updateTotal();
}

function deleteSelectedItems() {
  const checkboxes = document.querySelectorAll(".item-checkbox:checked, .toko-checkbox:checked");
  let itemIdsToDelete = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.classList.contains("toko-checkbox")) {
      const itemCheckboxes = checkbox.closest(".toko").querySelectorAll(".item-checkbox:checked");
      itemCheckboxes.forEach((itemCheckbox) => {
        itemIdsToDelete.push(itemCheckbox.getAttribute("data-id"));
        itemCheckbox.closest(".item-row").remove(); 
      });
      checkbox.closest(".toko").remove(); 
    } else {
      itemIdsToDelete.push(checkbox.getAttribute("data-id"));
      checkbox.closest(".item-row").remove(); 
    }
  });


  itemIdsToDelete.forEach((itemId) => {
    removeItemFromCart(itemId);
  });

  updateSelectedCount();
  document.getElementById("selectAll").checked = false;
  updateTotal();
}



function deleteItem(button) {
  const itemRow = button.closest(".item-row");
  removeItemFromCart(button.getAttribute("data-id"));
  itemRow.remove();
  updateSelectedCount();
  document.getElementById("selectAll").checked = false;
  updateTotal();
}

function changeQuantity(button, delta) {
  const quantitySpan = button.closest(".flex").querySelector(".quantity");
  let currentQuantity = parseInt(quantitySpan.innerText);
  currentQuantity += delta;
  if (currentQuantity < 1) currentQuantity = 1;
  quantitySpan.innerText = currentQuantity;
  updateTotal();
}

function toggleNoteInput(button) {
  const noteInput = button.closest(".flex-1").querySelector(".note-input");
  noteInput.classList.toggle("hidden");
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll(".item-row").forEach((row) => {
    if (row.querySelector(".item-checkbox").checked) {
      const price = parseFloat(row.querySelector(".harga").innerText.replace("$", "").replace(",", ""));
      const quantity = parseInt(row.querySelector(".quantity").innerText);
      total += price * quantity;
    }
  });
  document.querySelector(".total").innerText = "$" + total.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.getElementsByClassName("item-checkbox");
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", updateSelectedCount);
  }

  const deleteButton = document.querySelector('button[type="reset"]');
  deleteButton.addEventListener("click", function (event) {
    event.preventDefault();
    deleteSelectedItems();
  });

  updateTotal();
  displayCartItems()
});
