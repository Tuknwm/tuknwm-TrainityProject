const SEED_PRODUCTS = [
  {
    _id: "prod-001",
    name: "Belajar Python Dasar",
    shortDesc: "Kuasai Python dari nol, cocok untuk pemula absolute.",
    desc: "Kursus Python komprehensif yang membahas variabel, tipe data, kontrol alur, fungsi, OOP, hingga proyek nyata. Tidak diperlukan pengalaman programming sebelumnya.",
    video: [
      { _id: "v-001-1", namaPelajaran: "Pengenalan Python & Instalasi", kodePelajaran: "rfscVS0vtbw" },
      { _id: "v-001-2", namaPelajaran: "Variabel & Tipe Data", kodePelajaran: "8JJ101D3knE" },
      { _id: "v-001-3", namaPelajaran: "Kontrol Alur (if, for, while)", kodePelajaran: "nLRL_NcnK-4" },
    ],
    kodePelajaranPertama: "rfscVS0vtbw",
    price: 0,
  },
  {
    _id: "prod-002",
    name: "JavaScript Modern",
    shortDesc: "JavaScript ES6+ lengkap: async/await, fetch, dan DOM.",
    desc: "Pelajari JavaScript modern dari dasar hingga advanced. Materi mencakup ES6+, promises, async/await, fetch API, manipulasi DOM, dan pengembangan aplikasi web interaktif.",
    video: [
      { _id: "v-002-1", namaPelajaran: "JavaScript Dasar & ES6", kodePelajaran: "PkZNo7MFNFg" },
      { _id: "v-002-2", namaPelajaran: "DOM Manipulation", kodePelajaran: "W6NZfCO5SIk" },
      { _id: "v-002-3", namaPelajaran: "Async/Await & Fetch API", kodePelajaran: "jS4aFq5-91M" },
    ],
    kodePelajaranPertama: "PkZNo7MFNFg",
    price: 0,
  },
  {
    _id: "prod-003",
    name: "React untuk Pemula",
    shortDesc: "Bangun UI modern dengan React Hooks dan komponen.",
    desc: "Kursus React yang membahas komponen, props, state, hooks (useState, useEffect, useContext), React Router, dan integrasi dengan REST API. Cocok bagi yang sudah memahami JavaScript dasar.",
    video: [
      { _id: "v-003-1", namaPelajaran: "Pengenalan React & JSX", kodePelajaran: "Ke90Tje7VS0" },
      { _id: "v-003-2", namaPelajaran: "useState & useEffect", kodePelajaran: "bMknfKXIFA8" },
      { _id: "v-003-3", namaPelajaran: "React Router & Fetch", kodePelajaran: "SqcY0GlETPk" },
    ],
    kodePelajaranPertama: "Ke90Tje7VS0",
    price: 0,
  },
];

const SEED_USERS = [
  { _id: "user-admin-001", username: "Admin Trainity", email: "admin@trainity.com", password: "password123", role: "admin" },
  { _id: "user-demo-001", username: "Demo User", email: "demo@trainity.com", password: "password123", role: "user" },
];

const SEED_REVIEWS = [
  {
    _id: "rev-001", userId: "user-demo-001", userName: "Demo User",
    productId: "prod-001", productName: "Belajar Python Dasar",
    rating: 5, comment: "Kursus sangat bagus dan mudah dipahami, materinya lengkap!",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), status: "approved",
  },
  {
    _id: "rev-002", userId: "user-demo-001", userName: "Demo User",
    productId: "prod-002", productName: "JavaScript Modern",
    rating: 4, comment: "Penjelasan async/await sangat membantu. Recommended!",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), status: "approved",
  },
];

const SEED_USERPROD = [
  {
    _id: "up-001", userId: "user-demo-001", productId: "prod-001",
    lastWatchedVideoId: "v-001-2", createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

function lsGet(key, seed) {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) { localStorage.setItem(key, JSON.stringify(seed)); return seed; }
    return JSON.parse(raw);
  } catch { return seed; }
}

function lsSet(key, data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getProducts(searchKey) {
  const products = lsGet("trainity_products", SEED_PRODUCTS);
  if (!searchKey) return products;
  const lower = searchKey.toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(lower));
}

export function getProductByName(name) {
  return getProducts().find((p) => p.name === name || p.name === decodeURIComponent(name));
}

export function addProduct(product) {
  const products = getProducts();
  const newProd = { ...product, _id: `prod-${Date.now()}` };
  lsSet("trainity_products", [...products, newProd]);
  return newProd;
}

export function deleteProduct(id) {
  lsSet("trainity_products", getProducts().filter((p) => p._id !== id));
}

export function getUsers() { return lsGet("trainity_users", SEED_USERS); }
export function getUserByEmail(email) { return getUsers().find((u) => u.email === email); }
export function getUserById(id) { return getUsers().find((u) => u._id === id); }

export function addUser(user) {
  const users = getUsers();
  if (users.find((u) => u.email === user.email)) throw new Error("Email already registered");
  const newUser = { ...user, _id: `user-${Date.now()}` };
  lsSet("trainity_users", [...users, newUser]);
  return newUser;
}

export function updateUser(id, data) {
  const users = getUsers();
  const updated = users.map((u) => (u._id === id ? { ...u, ...data } : u));
  lsSet("trainity_users", updated);
  return updated.find((u) => u._id === id);
}

export function getReviews(productId) {
  const reviews = lsGet("trainity_reviews", SEED_REVIEWS);
  if (!productId) return reviews;
  return reviews.filter((r) => r.productId === productId);
}

export function getReviewsByProductName(productName) {
  const product = getProductByName(productName);
  if (!product) return [];
  return getReviews(product._id);
}

export function addReview(review) {
  const reviews = lsGet("trainity_reviews", SEED_REVIEWS);
  const newReview = { ...review, _id: `rev-${Date.now()}`, createdAt: new Date().toISOString(), status: "approved" };
  lsSet("trainity_reviews", [...reviews, newReview]);
  return newReview;
}

export function deleteReview(id) {
  lsSet("trainity_reviews", lsGet("trainity_reviews", SEED_REVIEWS).filter((r) => r._id !== id));
}

export function getUserProducts() { return lsGet("trainity_userproducts", SEED_USERPROD); }
export function getOwnedByUser(userId) { return getUserProducts().filter((up) => up.userId === userId); }
export function isProductOwned(userId, productId) { return getUserProducts().some((up) => up.userId === userId && up.productId === productId); }

export function buyProduct(userId, productId) {
  if (isProductOwned(userId, productId)) throw new Error("Already owned");
  const all = getUserProducts();
  const newUp = { _id: `up-${Date.now()}`, userId, productId, lastWatchedVideoId: null, createdAt: new Date().toISOString() };
  lsSet("trainity_userproducts", [...all, newUp]);
  return newUp;
}

export function updateLastWatched(userId, productId, videoId) {
  const all = getUserProducts();
  lsSet("trainity_userproducts", all.map((up) =>
    up.userId === userId && up.productId === productId ? { ...up, lastWatchedVideoId: videoId } : up,
  ));
}

export function getProgress(userId, productId) {
  const up = getUserProducts().find((u) => u.userId === userId && u.productId === productId);
  if (!up) return 0;
  const product = getProducts().find((p) => p._id === productId);
  if (!product || product.video.length === 0) return 0;
  if (!up.lastWatchedVideoId) return 0;
  const watchedIndex = product.video.findIndex((v) => v._id === up.lastWatchedVideoId);
  if (watchedIndex === -1) return 0;
  return Math.round(((watchedIndex + 1) / product.video.length) * 100);
}

export function getAdminDashboard() {
  const ups = getUserProducts();
  const users = getUsers();
  const products = getProducts();
  const reviews = getReviews();
  const latestUserActivity = ups.slice(-5).reverse().map((up) => {
    const user = users.find((u) => u._id === up.userId);
    const product = products.find((p) => p._id === up.productId);
    return { userName: user?.username ?? "Unknown", productName: product?.name ?? "Unknown", purchasedAt: up.createdAt };
  });
  const latestReviews = reviews.slice(-5).reverse().map((r) => ({
    productName: r.productName, rating: r.rating, comment: r.comment, userName: r.userName, reviewedAt: r.createdAt,
  }));
  return { latestUserActivity, latestReviews };
}

export function getPurchaseHistory(page, limit, search) {
  const all = getUserProducts();
  const users = getUsers();
  const products = getProducts();
  const enriched = all.map((up) => ({
    _id: up._id,
    user: { email: users.find((u) => u._id === up.userId)?.email ?? "unknown@email.com" },
    product: { name: products.find((p) => p._id === up.productId)?.name ?? "Unknown" },
    createdAt: up.createdAt,
  }));
  const filtered = search
    ? enriched.filter((e) => e.user.email.toLowerCase().includes(search.toLowerCase()) || e.product.name.toLowerCase().includes(search.toLowerCase()))
    : enriched;
  const total = filtered.length;
  const start = (page - 1) * limit;
  const userProducts = filtered.reverse().slice(start, start + limit);
  const hasNext = start + limit < total;
  return { userProducts, pagination: { total, hasNext } };
}
