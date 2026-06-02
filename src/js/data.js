const loadProducts = (callback) => {
  fetch('./data/test.json')
    .then(response => response.json())
    .then(data => callback(data));
}


const navbarLoad = (url_hero, url_home, url_pages) =>{
  const nav = document.querySelector('.navbar');

  nav.innerHTML = `
  <img src="${url_hero}public/logo.png" alt="Logo" class="navbar-logo">

    <ul class="navbar-menu">
      <a href="${url_home}"><li class="navbar-item">Home</li></a>
      <a href="${url_pages}/shop.html"><li class="navbar-item">Shop</li></a>
      <a href="${url_pages}/archivedOrder.html"><li class="navbar-item">Orders</li></a>
    </ul>

    <div id="search" class="navbar-search">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="navbar-search-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
      </svg>
      <input id="searchItem" type="text" placeholder="found your styles..." class="navbar-search-input" name="searchItem">
    </div>

    <div class="navbar-icons">
      <a href="./pages/userOrder.html" class="navbar-icon-link">
        <svg id="shopBag" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="navbar-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
        </svg>
      </a>
      <a href="./pages/profile.html" class="navbar-icon-link">
        <svg id="userIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="navbar-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
        </svg>
      </a>
  </div>
`
};


const formatRupiah = (num) => {
  return 'Rp ' + num.toLocaleString('id-ID');
}

const createProductCard = (product) => { 
  return `        
  <div id="productCard" class="relative w-9/40 h-full">        
    <div class=" relative overflow-hidden rounded-xl h-85">
      <img src="../public/jaket.png" alt="Product Image" class="w-full h-full object-cover"/>
    </div>
    <div class="flex w-full gap-2 justify-between text-lg font-semibold ">
      <p class="w-3/5 " title="${product.name}">${product.name}</p>      
      <span class="text-md">${formatRupiah(product.price)}</span>
    </div>    
    <p class="text-xs">${product.description}</p>        
  </div>        
  `;
}

