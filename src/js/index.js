const showUserNotification = (title, text, icon = 'info') => {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonColor: '#A30000'
    });
  } else {
    alert(`${title}\n${text}`);
  }
};

// --- 1. Login & Register ---
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  const re = /^\+?[0-9]{9,15}$/;
  return re.test(phone);
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 8;
};

const isLoggedIn = () => {
  return localStorage.getItem('currentUser') !== null;
};

const registerStep1 = (email, phone) => {
  if (!validateEmail(email)) {
    showUserNotification("Error", "Format email tidak valid!", "error");
    return { success: false, message: "Format email tidak valid!" };
  }
  if (!validatePhone(phone)) {
    showUserNotification("Error", "Format nomor HP tidak valid!", "error");
    return { success: false, message: "Format nomor HP tidak valid!" };
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const emailDup = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  const phoneDup = users.some(u => u.phone === phone);

  if (emailDup) {
    showUserNotification("Error", "Email sudah terdaftar!", "error");
    return { success: false, message: "Email sudah terdaftar!" };
  }
  if (phoneDup) {
    showUserNotification("Error", "Nomor HP sudah terdaftar!", "error");
    return { success: false, message: "Nomor HP sudah terdaftar!" };
  }

  sessionStorage.setItem('reg_step1', JSON.stringify({ email, phone }));
  showUserNotification("Sukses", "Langkah 1 berhasil. Lanjutkan ke pengisian username & password.", "success");
  return { success: true };
};

const registerStep2 = (username, password) => {
  if (!username || username.trim().length < 3) {
    showUserNotification("Error", "Username minimal 3 karakter!", "error");
    return { success: false, message: "Username minimal 3 karakter!" };
  }
  if (!validatePassword(password)) {
    showUserNotification("Error", "Password minimal 8 karakter!", "error");
    return { success: false, message: "Password minimal 8 karakter!" };
  }

  const step1Data = JSON.parse(sessionStorage.getItem('reg_step1'));
  if (!step1Data) {
    showUserNotification("Error", "Data langkah pertama tidak ditemukan. Mulai ulang registrasi.", "error");
    return { success: false, message: "Data pendaftaran langkah pertama tidak ditemukan!" };
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userDup = users.some(u => u.username.toLowerCase() === username.toLowerCase());
  if (userDup) {
    showUserNotification("Error", "Username sudah digunakan!", "error");
    return { success: false, message: "Username sudah digunakan!" };
  }

  const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = {
    id: nextId,
    email: step1Data.email,
    phone: step1Data.phone,
    username: username,
    password: password,
    role: 'user',
    addresses: []
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  sessionStorage.removeItem('reg_step1');

  showUserNotification("Sukses", "Pendaftaran berhasil! Silakan login.", "success");
  return { success: true };
};

const login = (emailOrPhone, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u =>
    (u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone) &&
    u.password === password
  );

  if (user) {
    const sessionUser = { ...user };
    delete sessionUser.password;
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));

    showUserNotification("Sukses Login", `Selamat datang kembali, ${sessionUser.username}!`, "success");
    return { success: true, user: sessionUser };
  }

  showUserNotification("Error", "Email/Nomor HP atau password salah!", "error");
  return { success: false, message: "Email/Nomor HP atau password salah!" };
};

const logout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('cart');
  const isPagesDir = window.location.pathname.includes('/pages/');

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: "Logout",
      text: "Anda telah keluar dari sistem.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      window.location.href = isPagesDir ? './login.html' : './pages/login.html';
    });
  } else {
    alert("Anda telah keluar dari sistem.");
    window.location.href = isPagesDir ? './login.html' : './pages/login.html';
  }
};


// --- 2. Profil & Buku Alamat ---
const loadProfile = (userId) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === Number(userId));
  if (user) {
    const profile = { ...user };
    delete profile.password;
    return profile;
  }
  return null;
};

const editUsername = (newUsername) => {
  if (!newUsername || newUsername.trim().length < 3) {
    showUserNotification("Error", "Username minimal 3 karakter!", "error");
    return { success: false, message: "Username minimal 3 karakter!" };
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return { success: false, message: "Tidak ada sesi aktif!" };

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const dup = users.some(u => u.username.toLowerCase() === newUsername.toLowerCase() && u.id !== currentUser.id);
  if (dup) {
    showUserNotification("Error", "Username sudah digunakan!", "error");
    return { success: false, message: "Username sudah digunakan!" };
  }

  const updatedUsers = users.map(u => {
    if (u.id === currentUser.id) {
      u.username = newUsername;
    }
    return u;
  });

  localStorage.setItem('users', JSON.stringify(updatedUsers));
  currentUser.username = newUsername;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  showUserNotification("Sukses", "Username berhasil diubah!", "success");
  return { success: true };
};

const loadAddresses = (userId) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === Number(userId));
  return user ? (user.addresses || []) : [];
};

const addAddress = (addressData) => {
  if (!addressData.name || !addressData.address || !addressData.city || !addressData.postalCode) {
    showUserNotification("Error", "Semua field alamat harus terisi!", "error");
    return { success: false, message: "Semua field alamat harus terisi!" };
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return { success: false, message: "Tidak ada sesi aktif!" };

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  let success = false;

  const updatedUsers = users.map(u => {
    if (u.id === currentUser.id) {
      if (!u.addresses) u.addresses = [];
      const nextId = u.addresses.length > 0 ? Math.max(...u.addresses.map(a => a.id)) + 1 : 1;
      u.addresses.push({
        id: nextId,
        name: addressData.name,
        address: addressData.address,
        city: addressData.city,
        postalCode: addressData.postalCode
      });
      success = true;
    }
    return u;
  });

  if (success) {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    const savedUser = updatedUsers.find(u => u.id === currentUser.id);
    const sessionUser = { ...savedUser };
    delete sessionUser.password;
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));

    showUserNotification("Sukses", "Alamat baru berhasil ditambahkan!", "success");
    return { success: true };
  }
  return { success: false, message: "User tidak ditemukan!" };
};

const editAddress = (addressId, newData) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return { success: false, message: "Tidak ada sesi aktif!" };

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  let success = false;

  const updatedUsers = users.map(u => {
    if (u.id === currentUser.id && u.addresses) {
      u.addresses = u.addresses.map(a => {
        if (a.id === Number(addressId)) {
          success = true;
          return { ...a, ...newData };
        }
        return a;
      });
    }
    return u;
  });

  if (success) {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    const savedUser = updatedUsers.find(u => u.id === currentUser.id);
    const sessionUser = { ...savedUser };
    delete sessionUser.password;
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));

    showUserNotification("Sukses", "Alamat berhasil diperbarui!", "success");
    return { success: true };
  }
  return { success: false, message: "Alamat tidak ditemukan!" };
};

const deleteAddress = (addressId) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return { success: false, message: "Tidak ada sesi aktif!" };

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  let success = false;

  const updatedUsers = users.map(u => {
    if (u.id === currentUser.id && u.addresses) {
      const originalLen = u.addresses.length;
      u.addresses = u.addresses.filter(a => a.id !== Number(addressId));
      if (u.addresses.length < originalLen) {
        success = true;
      }
    }
    return u;
  });

  if (success) {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    const savedUser = updatedUsers.find(u => u.id === currentUser.id);
    const sessionUser = { ...savedUser };
    delete sessionUser.password;
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));

    showUserNotification("Sukses", "Alamat berhasil dihapus!", "success");
    return { success: true };
  }
  return { success: false, message: "Alamat tidak ditemukan!" };
};


// --- 3. Katalog & Pencarian ---
const searchProducts = () => {
  const searchInput = document.getElementById('searchItem');
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));

  const container = document.getElementById('productsContainer');
  if (container) {
    container.replaceChildren();

    const escapeHTML = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const cards = filtered.map(product => {
      const escaped = {
        ...product,
        name: escapeHTML(product.name),
        description: escapeHTML(product.description),
        category: escapeHTML(product.category)
      };
      return createProductCard(escaped);
    });

    container.innerHTML = cards.join('');
  }
};

const bindSearchInput = () => {
  const searchInput = document.getElementById('searchItem');
  if (searchInput) {
    searchInput.addEventListener('input', searchProducts);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindSearchInput);
} else {
  bindSearchInput();
}

const filterByCategory = (categoryName) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const filtered = categoryName
    ? products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase())
    : products;

  const container = document.getElementById('productsContainer');
  if (container) {
    container.replaceChildren();

    const escapeHTML = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const cards = filtered.map(product => {
      const escaped = {
        ...product,
        name: escapeHTML(product.name),
        description: escapeHTML(product.description),
        category: escapeHTML(product.category)
      };
      return createProductCard(escaped);
    });

    container.innerHTML = cards.join('');
  }
  return filtered;
};


// --- 4. Keranjang Belanja ---
const addToCart = (productId, variantId, quantity) => {
  const qty = Number(quantity) || 1;
  if (qty <= 0) {
    showUserNotification("Error", "Jumlah harus lebih dari 0!", "error");
    return { success: false, message: "Jumlah harus lebih dari 0!" };
  }

  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const product = products.find(p => p.id === Number(productId));
  if (!product) {
    showUserNotification("Error", "Produk tidak ditemukan!", "error");
    return { success: false, message: "Produk tidak ditemukan!" };
  }

  const variant = product.variants ? product.variants.find(v => v.id === variantId) : null;
  if (!variant) {
    showUserNotification("Error", "Varian produk tidak ditemukan!", "error");
    return { success: false, message: "Varian produk tidak ditemukan!" };
  }

  if (variant.stock < qty) {
    showUserNotification("Stok Kurang", `Stok tidak mencukupi! Tersisa ${variant.stock} item.`, "warning");
    return { success: false, message: `Stok tidak mencukupi! Tersisa ${variant.stock} item.` };
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItemIndex = cart.findIndex(item => item.productId === Number(productId) && item.variantId === variantId);

  if (existingItemIndex > -1) {
    const targetQty = cart[existingItemIndex].quantity + qty;
    if (variant.stock < targetQty) {
      showUserNotification("Stok Kurang", `Total jumlah di keranjang (${targetQty}) melebihi stok (${variant.stock})!`, "warning");
      return { success: false, message: `Total jumlah di keranjang (${targetQty}) melebihi stok yang tersedia (${variant.stock})!` };
    }
    cart[existingItemIndex].quantity = targetQty;
  } else {
    cart.push({
      productId: Number(productId),
      variantId: variantId,
      quantity: qty
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  showUserNotification("Sukses", `Berhasil menambahkan "${product.name}" ke keranjang.`, "success");
  return { success: true, cart };
};

const removeItem = (productId, variantId) => {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const originalLen = cart.length;
  cart = cart.filter(item => !(item.productId === Number(productId) && item.variantId === variantId));

  localStorage.setItem('cart', JSON.stringify(cart));
  showUserNotification("Sukses", "Item berhasil dihapus dari keranjang.", "success");
  return { success: cart.length < originalLen, cart };
};

const calculateSubtotal = (item) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const product = products.find(p => p.id === Number(item.productId));
  if (!product) return 0;
  return product.price * item.quantity;
};

const calculateTotal = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  return cart.reduce((total, item) => total + calculateSubtotal(item), 0);
};

const validateCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const errors = [];

  if (cart.length === 0) {
    return { valid: false, errors: ["Keranjang Anda kosong!"] };
  }

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      errors.push(`Produk ID ${item.productId} tidak ditemukan.`);
      return;
    }
    const variant = product.variants ? product.variants.find(v => v.id === item.variantId) : null;
    if (!variant) {
      errors.push(`Varian untuk produk "${product.name}" tidak ditemukan.`);
      return;
    }
    if (variant.stock < item.quantity) {
      errors.push(`Stok "${product.name}" (${variant.color} - ${variant.size}) tidak cukup. Diminta: ${item.quantity}, Tersedia: ${variant.stock}.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors
  };
};

const proceedToCheckout = () => {
  const validation = validateCart();
  if (!validation.valid) {
    showUserNotification("Stok Tidak Cukup", validation.errors.join('\n'), "error");
    return { success: false, errors: validation.errors };
  }
  const isPagesDir = window.location.pathname.includes('/pages/');
  window.location.href = isPagesDir ? './checkout.html' : './pages/checkout.html';
  return { success: true };
};


// --- 5. Checkout & Pesanan ---
const generateOrderId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${dateStr}-${randNum}`;
};

const calculateShipping = (addressId) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return 0;

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === currentUser.id);
  if (!user || !user.addresses) return 15000;

  const address = user.addresses.find(a => a.id === Number(addressId));
  if (!address) return 15000;

  const city = address.city.toLowerCase();
  if (city.includes('jakarta')) {
    return 10000;
  } else if (city.includes('bogor') || city.includes('depok') || city.includes('tangerang') || city.includes('bekasi')) {
    return 15000;
  } else {
    return 25000;
  }
};

const calculateGrandTotal = (addressId) => {
  return calculateTotal() + calculateShipping(addressId);
};

const submitOrder = (addressId) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    showUserNotification("Akses Ditolak", "Anda harus login terlebih dahulu!", "error");
    return { success: false, message: "Anda harus login terlebih dahulu!" };
  }

  const validation = validateCart();
  if (!validation.valid) {
    showUserNotification("Error Keranjang", validation.errors.join('\n'), "error");
    return { success: false, message: validation.errors.join('\n') };
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const user = users.find(u => u.id === currentUser.id);
  const shippingAddress = user ? user.addresses.find(a => a.id === Number(addressId)) : null;
  if (!shippingAddress) {
    showUserNotification("Alamat Salah", "Pilih alamat pengiriman yang valid!", "warning");
    return { success: false, message: "Pilih alamat pengiriman yang valid!" };
  }

  const orderItems = [];
  const updatedProducts = products.map(product => {
    const productCartItems = cart.filter(item => item.productId === product.id);
    if (productCartItems.length > 0) {
      if (product.variants) {
        product.variants = product.variants.map(variant => {
          const cartItem = productCartItems.find(item => item.variantId === variant.id);
          if (cartItem) {
            variant.stock -= cartItem.quantity;
            orderItems.push({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              variantId: variant.id,
              color: variant.color,
              size: variant.size,
              quantity: cartItem.quantity,
              subtotal: product.price * cartItem.quantity
            });
          }
          return variant;
        });
      }
      product.stock = product.variants ? product.variants.reduce((sum, v) => sum + v.stock, 0) : product.stock;
    }
    return product;
  });

  const orderId = generateOrderId();
  const shippingCost = calculateShipping(addressId);
  const totalAmount = calculateTotal();
  const grandTotal = totalAmount + shippingCost;

  const newOrder = {
    id: orderId,
    userId: currentUser.id,
    items: orderItems,
    shippingAddress: shippingAddress,
    shippingCost: shippingCost,
    totalAmount: totalAmount,
    grandTotal: grandTotal,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  localStorage.setItem('cart', JSON.stringify([]));

  const isPagesDir = window.location.pathname.includes('/pages/');

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: "Pesanan Dikirim!",
      text: `Nomor Pesanan: ${orderId}\nTotal Pembayaran: Rp ${grandTotal.toLocaleString('id-ID')}`,
      icon: "success",
      confirmButtonText: "Buka Riwayat Pesanan",
      confirmButtonColor: '#A30000'
    }).then(() => {
      window.location.href = isPagesDir ? './archivedOrder.html' : './pages/archivedOrder.html';
    });
  } else {
    alert(`Pesanan Dikirim!\nNomor Pesanan: ${orderId}`);
    window.location.href = isPagesDir ? './archivedOrder.html' : './pages/archivedOrder.html';
  }

  return { success: true, orderId };
};

const filterOrderByStatus = (status) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return [];

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const userOrders = orders.filter(o => o.userId === currentUser.id);

  if (!status || status === 'All') {
    return userOrders;
  }
  return userOrders.filter(o => o.status.toLowerCase() === status.toLowerCase());
};
