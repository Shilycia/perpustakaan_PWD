const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Gravity Box Hoodie",
        category: "Tops",
        price: 899000,
        badge: null,
        image: "../../public/img/id 1.png",
        desc: "Carbon Black tactical hoodie with oversized fit. Engineered for the city."
    }, {
        id: 2,
        name: "Module Cargo V2",
        category: "Bottoms",
        price: 1250000,
        badge: null,
        image: "../../public/img/id 2.png",
        desc: "Tactical Olive cargo pants with modular pockets and reinforced core."
    }, {
        id: 3,
        name: "Aether Windshell",
        category: "Outerwear",
        price: 1599000,
        badge: null,
        image: "../../public/img/id 3.png",
        desc: "Frost/Crimson lightweight windproof jacket for 360° breathability."
    }, {
        id: 4,
        name: "Industrial Chain Belt",
        category: "Accessories",
        price: 450000,
        badge: null,
        image: "../../public/img/id 4.png",
        desc: "Brushed steel industrial style belt. Minimalist yet bold."
    }, {
        id: 5,
        name: "Velocity Oversized Hoodie",
        category: "Tops",
        price: 1450000,
        badge: "New Arrival",
        image: "../../public/img/id 5.png",
        desc: "Phantom Black premium oversized hoodie. High energy return fabric."
    }, {
        id: 6,
        name: "Architect Biker Jacket",
        category: "Outerwear",
        price: 4200000,
        badge: null,
        image: "../../public/img/id 6.png",
        desc: "Midnight Obsidian leather biker jacket. Precision engineering."
    }, {
        id: 7,
        name: "Logo Core Heavy Tee",
        category: "Tops",
        price: 650000,
        badge: "Sold Out",
        image: "../../public/img/id 7.png",
        desc: "Optic White heavy cotton tee with crimson logo."
    }, {
        id: 8,
        name: "Cargo Tech Pants 2.0",
        category: "Bottoms",
        price: 1850000,
        badge: null,
        image: "../../public/img/id 8.png",
        desc: "Matt Black advanced techwear pants. Water-resistant."
    }, {
        id: 9,
        name: "Velocity High-Top V1",
        category: "Footwear",
        price: 3550000,
        badge: "Limited Edition",
        image: "../../public/img/id 9.png",
        desc: "Bred Legacy high-top sneakers with Kinetic Foam technology."
    }, {
        id: 10,
        name: "Modular Commuter Pack",
        category: "Accessories",
        price: 2100000,
        badge: null,
        image: "../../public/img/id 10.png",
        desc: "Stealth Black modular backpack for the modern metropolitan life."
    }, {
        id: 11,
        name: "Urban Velocity Runner",
        category: "Footwear",
        price: 2499000,
        badge: null,
        image: "../../public/img/id 11.jpg",
        desc: "Performance runner shoes in Midnight/Crimson."
    }, {
        id: 12,
        name: "Core Graphic Long Tee",
        category: "Tops",
        price: 750000,
        badge: null,
        image: "../../public/img/id 12.jpg",
        desc: "Long sleeve graphic tee with urban typography."
    }, {
        id: 13,
        name: "Techwear Utility Vest",
        category: "Outerwear",
        price: 1799000,
        badge: "New Arrival",
        image: "../../public/img/id 13.jpg",
        desc: "Multi-pocket utility vest. High contrast accents."
    }, {
        id: 14,
        name: "Monochrome Slim Jogger",
        category: "Bottoms",
        price: 1100000,
        badge: null,
        image: "../../public/img/id 14.jpg",
        desc: "Slim fit monochrome joggers with stretch tech."
    }, {
        id: 15,
        name: "Stealth Crossbody Bag",
        category: "Accessories",
        price: 980000,
        badge: null,
        image: "../../public/img/id 15.jpg",
        desc: "Compact stealth crossbody bag for essential carry."
    }, {
        id: 16,
        name: "High-Contrast Snapback",
        category: "Accessories",
        price: 350000,
        badge: null,
        image: "../../public/img/id 16.jpg",
        desc: "Signature high-contrast snapback hat."
    }
];

const vibesDB = {
    // Produk
    getProducts: () => PRODUCTS_DATA,
    getProduct: (id) => PRODUCTS_DATA.find(p => p.id == id),

    // Auth & Users
    getUsers: () => JSON.parse(localStorage.getItem('vibes_users')) || [],
    saveUsers: (users) => localStorage.setItem(
        'vibes_users',
        JSON.stringify(users)
    ),

    registerUser: (email, password) => {
        const users = vibesDB.getUsers();
        if (users.find(u => u.email === email)) {
            return {success: false, message: "Email sudah terdaftar!"};
        }
        const newUser = {
            id: 'usr_' + Date.now(),
            email: email,
            password: btoa(password),
            firstName: "Urban",
            lastName: "Insider",
            points: 0,
            addresses: []
        };
        users.push(newUser);
        vibesDB.saveUsers(users);
        vibesDB.setCurrentUser(newUser);
        return {success: true, message: "Registrasi berhasil!"};
    },

    loginUser: (email, password) => {
        const users = vibesDB.getUsers();
        const user = users.find(
            u => u.email === email && u.password === btoa(password)
        );
        if (user) {
            vibesDB.setCurrentUser(user);
            return {success: true, message: "Login berhasil!"};
        }
        return {success: false, message: "Email atau password salah!"};
    },

    setCurrentUser: (user) => localStorage.setItem(
        'vibes_session',
        JSON.stringify(user)
    ),
    getCurrentUser: () => JSON.parse(localStorage.getItem('vibes_session')),
    logout: () => localStorage.removeItem('vibes_session'),

    updateCurrentUser: (userData) => {
        const users = vibesDB.getUsers();
        const index = users.findIndex(u => u.id === userData.id);
        if (index > -1) {
            users[index] = userData;
            vibesDB.saveUsers(users);
            vibesDB.setCurrentUser(userData);
        }
    },

    // Fitur Cart
    getCart: () => {
        const user = vibesDB.getCurrentUser();
        if (!user) 
            return [];
        const allCarts = JSON.parse(localStorage.getItem('vibes_carts')) || {};
        return allCarts[user.id] || [];
    },

    saveCart: (cartItems) => {
        const user = vibesDB.getCurrentUser();
        if (!user) 
            return;
        const allCarts = JSON.parse(localStorage.getItem('vibes_carts')) || {};
        allCarts[user.id] = cartItems;
        localStorage.setItem('vibes_carts', JSON.stringify(allCarts));
    },

    addToCart: (product, qty, size, customPrice) => {
        const cart = vibesDB.getCart();
        const existing = cart.find(item => item.productId === product.id && item.size === size);
        if(existing) {
            existing.qty += qty;
        } else {
            cart.push({
                cartItemId: 'ci_' + Date.now(),
                productId: product.id,
                name: product.name,
                image: product.image,
                // Menggunakan customPrice (harga + tambahan size), fallback ke harga default jika tidak ada
                price: customPrice || product.price, 
                size: size,
                qty: qty
            });
        }
        vibesDB.saveCart(cart);
    },
    
    updateCartQty: (cartItemId, newQty) => {
        let cart = vibesDB.getCart();
        cart = cart.map(item => {
            if (item.cartItemId === cartItemId) 
                item.qty = newQty;
            return item;
        });
        vibesDB.saveCart(cart);
    },

    removeFromCart: (cartItemId) => {
        let cart = vibesDB.getCart();
        cart = cart.filter(item => item.cartItemId !== cartItemId);
        vibesDB.saveCart(cart);
    },

    // Fitur Pesanan
    getOrders: () => {
        const user = vibesDB.getCurrentUser();
        if (!user) 
            return [];
        const allOrders = JSON.parse(localStorage.getItem('vibes_orders')) || [];
        return allOrders
            .filter(o => o.userId === user.id)
            .sort((a, b) => b.timestamp - a.timestamp);
    },

    createOrder: (checkoutData) => {
        const user = vibesDB.getCurrentUser();
        const cart = vibesDB.getCart();
        if (!user || cart.length === 0) 
            return false;
        
        let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // POINT SYSTEM: 1 Point per Rp 1.000 spent
        const pointsEarned = Math.floor(subtotal / 1000);
        user.points = (user.points || 0) + pointsEarned;
        vibesDB.updateCurrentUser(user);

        const newOrder = {
            orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            userId: user.id,
            items: cart,
            total: subtotal + 45000 + (subtotal * 0.11),
            status: 'WAITING PAYMENT',
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            timestamp: Date.now()
        };

        const allOrders = JSON.parse(localStorage.getItem('vibes_orders')) || [];
        allOrders.push(newOrder);
        localStorage.setItem('vibes_orders', JSON.stringify(allOrders));

        vibesDB.saveCart([]);
        return newOrder.orderId;
    }
};

window.vibesDB = vibesDB;