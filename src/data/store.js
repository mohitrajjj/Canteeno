import { SEED_MENU } from "./seedMenu";

const KEYS = {
  EMPLOYEES: "CANTEENO_EMPLOYEES",
  MENU: "CANTEENO_MENU",
  ORDERS: "CANTEENO_ORDERS",
  SESSION: "CANTEENO_SESSION",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

// ---------- Menu ----------
export function getMenu() {
  const existing = read(KEYS.MENU, null);
  if (existing) return existing;
  write(KEYS.MENU, SEED_MENU);
  return SEED_MENU;
}

export function saveMenu(menu) {
  write(KEYS.MENU, menu);
}

export function addMenuItem(item) {
  const menu = getMenu();
  const newItem = { ...item, id: makeId("m") };
  const updated = [...menu, newItem];
  saveMenu(updated);
  return updated;
}

export function updateMenuItem(id, changes) {
  const menu = getMenu();
  const updated = menu.map((m) => (m.id === id ? { ...m, ...changes } : m));
  saveMenu(updated);
  return updated;
}

export function deleteMenuItem(id) {
  const menu = getMenu();
  const updated = menu.filter((m) => m.id !== id);
  saveMenu(updated);
  return updated;
}

// ---------- Employees ----------
export function getEmployees() {
  return read(KEYS.EMPLOYEES, []);
}

export function saveEmployees(list) {
  write(KEYS.EMPLOYEES, list);
}

export function addEmployee(emp) {
  const list = getEmployees();
  const newEmp = {
    ...emp,
    id: makeId("EMP"),
    wallet: 0,
    createdAt: new Date().toLocaleDateString("en-GB"),
  };
  const updated = [...list, newEmp];
  saveEmployees(updated);
  return updated;
}

export function deleteEmployee(id) {
  const list = getEmployees();
  const updated = list.filter((e) => e.id !== id);
  saveEmployees(updated);
  return updated;
}

export function adjustWallet(id, amount) {
  const list = getEmployees();
  const updated = list.map((e) =>
    e.id === id ? { ...e, wallet: Math.max(0, +(e.wallet + amount).toFixed(2)) } : e
  );
  saveEmployees(updated);
  return updated;
}

export function getEmployeeById(id) {
  return getEmployees().find((e) => e.id === id) || null;
}

// ---------- Orders ----------
export function getOrders() {
  return read(KEYS.ORDERS, []);
}

export function saveOrders(list) {
  write(KEYS.ORDERS, list);
}

// Places an order, deducts wallet balance, and records it.
// Returns { success, error, orders, employees }
export function placeOrder(employeeId, cartItems) {
  const employees = getEmployees();
  const employee = employees.find((e) => e.id === employeeId);
  if (!employee) return { success: false, error: "Employee not found." };

  const total = +cartItems
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);

  if (total > employee.wallet) {
    return {
      success: false,
      error: `Insufficient wallet balance. Order total is $${total.toFixed(
        2
      )}, wallet has $${employee.wallet.toFixed(2)}.`,
    };
  }

  const order = {
    id: makeId("ORD"),
    employeeId,
    employeeName: `${employee.fName} ${employee.lName}`,
    items: cartItems,
    total,
    createdAt: new Date().toLocaleString("en-GB"),
  };

  const updatedOrders = [order, ...getOrders()];
  saveOrders(updatedOrders);

  const updatedEmployees = adjustWallet(employeeId, -total);

  return { success: true, order, orders: updatedOrders, employees: updatedEmployees };
}

export function getOrdersByEmployee(employeeId) {
  return getOrders().filter((o) => o.employeeId === employeeId);
}

// ---------- Session ----------
export function getSession() {
  return read(KEYS.SESSION, null);
}

export function setSession(session) {
  write(KEYS.SESSION, session);
}

export function clearSession() {
  localStorage.removeItem(KEYS.SESSION);
}
