
let balance =
    localStorage.getItem('balance')
    ? parseInt(localStorage.getItem('balance'))
    : 1000;

let cart = [];

let allProducts = [];

let currentSlide = 0;

let discountPercent = 0;

document.getElementById('user-balance').innerText =
    balance;

fetchProducts();

loadReviews();

setInterval(nextSlide, 3000);


// FETCH PRODUCTS
function fetchProducts(){

    fetch('./Data/Products.json')

    .then(response => response.json())

    .then(data => {

        allProducts = data.products;

        renderProducts(allProducts);

    })

    .catch(error => {

        console.log(error);

    });

}


// RENDER PRODUCTS
function renderProducts(products){

    const grid =
        document.getElementById('product-grid');

    grid.innerHTML =
        products.map(product => `

            <div class="bg-white dark:bg-gray-800 rounded shadow overflow-hidden hover:scale-105 transition duration-300">

                <img src="${product.image}"
                    class="w-full h-44 sm:h-52 object-cover">

                <div class="p-4">

                    <h3 class="text-lg sm:text-xl font-bold mb-2">

                        ${product.title}

                    </h3>

                    <p class="mb-2 text-gray-500">

                        ${product.category}

                    </p>

                    <div class="flex justify-between items-center mb-4">

                        <span class="font-bold">

                            ${product.price} BDT

                        </span>

                        <span>

                            ⭐ ${product.rating.rate}

                        </span>

                    </div>

                    <div class="flex flex-col sm:flex-row gap-2">

                        <!-- ADD -->
                        <button
                            onclick="addToCart(
                                ${product.id},
                                ${product.price},
                                '${product.title.replace(/'/g, "")}'
                            )"
                            class="bg-blue-600 text-white px-4 py-2 rounded w-full text-sm sm:text-base"
                        >

                            Add To Cart

                        </button>

                        <!-- REMOVE -->
                        <button
                            onclick="removeProductPrice(
                                ${product.id}
                            )"
                            class="bg-red-500 text-white px-4 py-2 rounded w-full text-sm sm:text-base"
                        >

                            Remove

                        </button>

                    </div>

                </div>

            </div>

        `).join('');

}


// ADD TO CART
function addToCart(id, price, title){

    const currentTotal =
        calculateTotal();

    if(currentTotal + price > balance){

        alert("Insufficient Balance!");

        return;

    }

    cart.push({
        id,
        price,
        title
    });

    renderCart();

}


// REMOVE PRODUCT
function removeProductPrice(id){

    const index =
        cart.findIndex(item =>
            item.id === id
        );

    if(index !== -1){

        cart.splice(index, 1);

        renderCart();

    }
    else{

        alert("Product not found in cart");

    }

}


// CALCULATE TOTAL
function calculateTotal(){

    const subtotal =
        cart.reduce((sum, item) =>
            sum + item.price,
        0);

    const discount =
        (subtotal * discountPercent) / 100;

    return (subtotal + 30 + 50) - discount;

}


// RENDER CART
function renderCart(){

    const container =
        document.getElementById('cart-items');

    container.innerHTML = "";

    if(cart.length === 0){

        container.innerHTML = `
            <p class="text-gray-500">
                Cart is empty
            </p>
        `;
    }

    

    const subtotal =
        cart.reduce((sum, item) =>
            sum + item.price,
        0);

    const discountAmount =
        (subtotal * discountPercent) / 100;

    document.getElementById('subtotal').innerText =
        subtotal.toFixed(2);

    document.getElementById('discount').innerText =
        discountAmount.toFixed(2);

    document.getElementById('final-total').innerText =
        calculateTotal().toFixed(2);

}


// REMOVE CART ITEM
function removeCart(index){

    cart.splice(index, 1);

    renderCart();

}


// SEARCH
function filterProducts(){

    const term =
        document.getElementById('search-input')
        .value
        .toLowerCase();

    const filtered =
        allProducts.filter(product =>

            product.title.toLowerCase().includes(term)
            ||
            product.category.toLowerCase().includes(term)

        );

    renderProducts(filtered);

}


// SORT
function sortProducts(){

    const value =
        document.getElementById('sort-select')
        .value;

    let sorted = [...allProducts];

    if(value === "low"){

        sorted.sort((a,b) =>
            a.price - b.price
        );

    }

    if(value === "high"){

        sorted.sort((a,b) =>
            b.price - a.price
        );

    }

    renderProducts(sorted);

}


// APPLY COUPON
function applyCoupon(){

    const code =
        document.getElementById('coupon-input')
        .value;

    if(code === "SMART10"){

        discountPercent = 10;

        alert("Coupon Applied!");

        renderCart();

    }
    else{

        alert("Invalid Coupon");

    }

}


// ADD MONEY
function addMoney(){

    balance += 1000;

    updateUI();

}


// UPDATE UI
function updateUI(){

    document.getElementById('user-balance').innerText =
        balance;

    localStorage.setItem('balance', balance);

    renderCart();

}


// BUY NOW
function buyNow(){

    const total =
        calculateTotal();

    if(cart.length === 0){

        alert("Cart is empty");

        return;

    }

    if(balance < total){

        alert("Insufficient Balance");

        return;

    }

    balance -= total;

    updateUI();

    alert("Purchase Successful");

    cart = [];

    discountPercent = 0;

    renderCart();

}


// LOAD REVIEWS
function loadReviews(){

    fetch('./Data/Reviews.json')

    .then(response => response.json())

    .then(data => {

        const reviews =
            data.reviews;

        const reviewContainer =
            document.getElementById('review-container');

        reviewContainer.innerHTML =
            reviews.map(review => `

                <div class="bg-white dark:bg-gray-700 p-4 sm:p-6 rounded shadow">

                    <p class="mb-3">

                        "${review.text}"

                    </p>

                    <h4 class="font-bold">

                        - ${review.name}

                    </h4>

                    <p>

                        ★ ${review.rating}/5

                    </p>

                    <p class="text-sm text-gray-400 mt-2">

                        ${review.date}

                    </p>

                </div>

            `).join('');

    })

    .catch(error => {

        console.log(error);

    });

}


// CONTACT FORM
function handleContact(event){

    event.preventDefault();

    document.getElementById('thank-you')
    .classList.remove('hidden');

    document.getElementById('contact-form')
    .reset();

}


// MOBILE MENU
function toggleMenu(){

    document.getElementById('mobile-menu')
    .classList.toggle('hidden');

}


// THEME
function toggleTheme(){

    document.documentElement
    .classList.toggle('dark');

}


// ABOUT POPUP
function openAbout(){

    document.getElementById('about-popup')
    .classList.remove('hidden');

}


function closeAbout(){

    document.getElementById('about-popup')
    .classList.add('hidden');

}


// SLIDER
function showSlide(index){

    const banner =
        document.getElementById('banner-container');

    const totalSlides =
        banner.children.length;

    if(index >= totalSlides){

        currentSlide = 0;

    }

    else if(index < 0){

        currentSlide = totalSlides - 1;

    }

    else{

        currentSlide = index;

    }

    banner.style.transform =
        `translateX(-${currentSlide * 100}%)`;

}


function nextSlide(){

    showSlide(currentSlide + 1);

}


function prevSlide(){

    showSlide(currentSlide - 1);

}
