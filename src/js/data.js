const loadProducts = (callback) => {
  fetch('../data/test.json')
    .then(response => response.json())
    .then(data => callback(data));
}

function autoResizeIframe(...ids) {
  ids.forEach(id => {
    const frame = document.getElementById(id);
    if (!frame) return;
    frame.onload = () => {
      // Tunggu semua gambar di dalam iframe selesai load
      const iframeWindow = frame.contentWindow;
      iframeWindow.addEventListener('load', resize);
      
      // Kalau sudah complete, langsung resize
      if (iframeWindow.document.readyState === 'complete') {
        resize();
      }

      function resize() {
        frame.style.height = 'auto';
        frame.style.height = frame.contentDocument.body.scrollHeight + 'px';
      }
    }
  });
}

function truncate(text) {
  const max = 30
  return text.length > max ? text.slice(0, max) + "..." : text;
}




const formatRupiah = (num) => {
  return 'Rp ' + num.toLocaleString('id-ID');
}

const createProductCard = (product) => { 
  return `        
  <div class="productCard">        
    <div class="productCardImage">
      <img src="../../public/jaket.png" alt="Product Image"/>
    </div>
    <div class="cardInfoWrapper">
      <div class="productCardInfo">
      <p class="productCardName" title="${product.name}">${product.name}</p>      
      <span class="productCardPrice">${formatRupiah(product.price)}</span>
    </div>    
    <p class="productCardDesc">${truncate(product.description)}</p>        
    </div>        
  </div>      
  `;
}


const productShop = (product) => { 
  return `        
  <div class="productCard">        
    <div class="productCardImage">
      <img src="../../public/jaket.png" alt="Product Image"/>
    </div>
    <div class="cardInfoWrapper">
      <div class="productInfo">
      <p class="productCardName" title="${product.name}">${product.name}</p>      
      <span class="productCardPrice">${formatRupiah(product.price)}</span>
    </div>    
    <p class="productCardDesc">${truncate(product.description)}</p>        
    </div>        
  </div>      
  `;
}