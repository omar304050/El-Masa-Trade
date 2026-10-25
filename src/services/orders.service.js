const STORAGE_KEY = "masa-orders";

export function getOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  const orders = getOrders();
  const next = [order, ...orders];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return order;
}
