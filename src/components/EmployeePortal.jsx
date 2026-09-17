import React, { useState, useEffect } from "react";
import { Button, Card, Badge, EmptyState, Select } from "./UI";
import { TopNav, TabBar } from "./AdminPortal";
import { getEmployees, getMenu, placeOrder, getOrdersByEmployee } from "../data/store";
import { CATEGORIES } from "../data/seedMenu";

const TABS = ["Order Food", "My Orders", "Wallet"];

export default function EmployeePortal({ onLogout }) {
  const [employees] = useState(getEmployees());
  const [selectedId, setSelectedId] = useState("");
  const [tab, setTab] = useState("Order Food");
  const [menu] = useState(getMenu());
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState("All");
  const [wallet, setWallet] = useState(0);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState(null);

  const employee = employees.find((e) => e.id === selectedId);

  const refresh = () => {
    const fresh = getEmployees().find((e) => e.id === selectedId);
    setWallet(fresh ? fresh.wallet : 0);
    setOrders(getOrdersByEmployee(selectedId));
  };

  useEffect(() => {
    if (selectedId) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  if (!selectedId) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
        <TopNav title="Employee Portal" onLogout={onLogout} />
        <div style={{ maxWidth: "480px", margin: "60px auto", padding: "0 20px" }}>
          <Card>
            <h3 style={{ color: "var(--navy)", marginBottom: "14px" }}>Who's ordering?</h3>
            {employees.length === 0 ? (
              <EmptyState
                title="No employees registered yet"
                subtitle="Ask an admin to register you before you can order."
              />
            ) : (
              <>
                <Select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  <option value="">Select your name...</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fName} {e.lName}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </Card>
        </div>
      </div>
    );
  }

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: existing
          ? { ...existing, qty: existing.qty + 1 }
          : { menuItemId: item.id, name: item.name, price: item.price, qty: 1 },
      };
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...existing, qty: existing.qty - 1 } };
    });
  };

  const checkout = () => {
    const result = placeOrder(selectedId, cartItems);
    if (!result.success) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    setCart({});
    setMessage({ type: "success", text: `Order placed! $${result.order.total.toFixed(2)} deducted from your wallet.` });
    refresh();
    setTimeout(() => setMessage(null), 4000);
  };

  const filteredMenu = category === "All" ? menu : menu.filter((m) => m.category === category);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <TopNav title={`Employee Portal — ${employee?.fName || ""}`} onLogout={onLogout} />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 20px" }}>
        <TabBar tab={tab} setTab={setTab} tabs={TABS} />

        {message && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "16px",
              background: message.type === "error" ? "#fbe9e7" : "#e3f0e9",
              color: message.type === "error" ? "var(--clay)" : "var(--sage)",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {message.text}
          </div>
        )}

        {tab === "Order Food" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      background: category === c ? "var(--saffron)" : "var(--white)",
                      color: "var(--navy)",
                      border: "1px solid var(--border)",
                      borderRadius: "20px",
                      padding: "6px 16px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                {filteredMenu.map((item) => (
                  <Card key={item.id} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "10px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "var(--navy)" }}>{item.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "#8a8a8a", marginBottom: "4px" }}>{item.desc}</div>
                      <Badge>${item.price.toFixed(2)}</Badge>
                    </div>
                    <Button onClick={() => addToCart(item)}>Add</Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Receipt-style cart */}
            <div>
              <div
                style={{
                  background: "var(--white)",
                  borderRadius: "10px 10px 0 0",
                  padding: "20px",
                  border: "1px solid var(--border)",
                  borderBottom: "none",
                }}
              >
                <h3 style={{ color: "var(--navy)", marginBottom: "4px" }}>Your Order</h3>
                <div style={{ fontSize: "0.78rem", color: "#8a8a8a", marginBottom: "14px" }}>
                  Wallet balance: ${wallet.toFixed(2)}
                </div>
                {cartItems.length === 0 ? (
                  <div style={{ color: "#8a8a8a", fontSize: "0.88rem", padding: "10px 0" }}>
                    Your cart is empty. Add items from the menu.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.menuItemId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.88rem",
                        padding: "6px 0",
                        fontFamily: "monospace",
                      }}
                    >
                      <span>{item.name} x{item.qty}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        ${(item.price * item.qty).toFixed(2)}
                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          style={{ background: "none", border: "none", color: "var(--clay)", cursor: "pointer", fontFamily: "inherit" }}
                      >
                          ✕
                      </button>
                    </span>
                    </div>
                  ))
                )}
              </div>
              <div
                style={{
                  background: "var(--white)",
                  borderRadius: "0 0 10px 10px",
                  padding: "16px 20px",
                  borderLeft: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  borderTop: "2px dashed var(--border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: "12px" }}>
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Button full disabled={cartItems.length === 0} onClick={checkout}>
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        )}

        {tab === "My Orders" && (
          <Card>
            {orders.length === 0 ? (
              <EmptyState title="No orders yet" subtitle="Your order history will appear here." />
            ) : (
              orders.map((o) => (
                <div key={o.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: "0.85rem", color: "#8a8a8a" }}>{o.createdAt}</div>
                    <div style={{ fontWeight: 700, color: "var(--sage)" }}>${o.total.toFixed(2)}</div>
                  </div>
                  <div style={{ fontSize: "0.88rem" }}>{o.items.map((i) => `${i.name} x${i.qty}`).join(", ")}</div>
                </div>
              ))
            )}
          </Card>
        )}

        {tab === "Wallet" && (
          <Card style={{ maxWidth: "360px" }}>
            <div style={{ fontSize: "0.85rem", color: "#8a8a8a", fontWeight: 600 }}>Current Balance</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "var(--sage)", marginBottom: "10px" }}>
              ${wallet.toFixed(2)}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#8a8a8a" }}>
              Ask an admin to add funds to your wallet from the Employees tab.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
