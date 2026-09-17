import React, { useState } from "react";
import { Button, Card, Input, Select, Badge, EmptyState } from "./UI";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  adjustWallet,
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getOrders,
} from "../data/store";
import { CATEGORIES } from "../data/seedMenu";

const TABS = ["Overview", "Employees", "Menu", "Orders"];

export default function AdminPortal({ onLogout }) {
  const [tab, setTab] = useState("Overview");
  const [employees, setEmployees] = useState(getEmployees());
  const [menu, setMenu] = useState(getMenu());
  const [orders, setOrders] = useState(getOrders());

  const refreshAll = () => {
    setEmployees(getEmployees());
    setMenu(getMenu());
    setOrders(getOrders());
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <TopNav title="Admin Dashboard" onLogout={onLogout} />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 20px" }}>
        <TabBar tab={tab} setTab={setTab} tabs={TABS} />
        {tab === "Overview" && <Overview employees={employees} orders={orders} menu={menu} />}
        {tab === "Employees" && (
          <EmployeesTab
            employees={employees}
            onAdd={(data) => {
              addEmployee(data);
              refreshAll();
            }}
            onDelete={(id) => {
              deleteEmployee(id);
              refreshAll();
            }}
            onFund={(id, amt) => {
              adjustWallet(id, amt);
              refreshAll();
            }}
          />
        )}
        {tab === "Menu" && (
          <MenuTab
            menu={menu}
            onAdd={(item) => {
              addMenuItem(item);
              refreshAll();
            }}
            onUpdate={(id, changes) => {
              updateMenuItem(id, changes);
              refreshAll();
            }}
            onDelete={(id) => {
              deleteMenuItem(id);
              refreshAll();
            }}
          />
        )}
        {tab === "Orders" && <OrdersTab orders={orders} />}
      </div>
    </div>
  );
}

export function TopNav({ title, onLogout }) {
  return (
    <div
      style={{
        background: "var(--navy)",
        color: "var(--white)",
        padding: "18px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.6rem", color: "var(--saffron)" }}>
        Canteeno <span style={{ fontFamily: "Outfit", fontSize: "1rem", color: "#c9d1e3" }}>/ {title}</span>
      </div>
      <button
        onClick={onLogout}
        style={{
          background: "transparent",
          border: "1.5px solid #c9d1e3",
          color: "#c9d1e3",
          borderRadius: "8px",
          padding: "6px 16px",
          cursor: "pointer",
          fontSize: "0.85rem",
        }}
      >
        Switch role
      </button>
    </div>
  );
}

export function TabBar({ tab, setTab, tabs }) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "22px", flexWrap: "wrap" }}>
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          style={{
            background: tab === t ? "var(--navy)" : "var(--white)",
            color: tab === t ? "var(--white)" : "var(--navy)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "9px 18px",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function Overview({ employees, orders, menu }) {
  const todayStr = new Date().toLocaleDateString("en-GB");
  const todaysOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const todaysRevenue = todaysOrders.reduce((s, o) => s + o.total, 0);
  const totalWallets = employees.reduce((s, e) => s + e.wallet, 0);

  const stats = [
    { label: "Employees", value: employees.length },
    { label: "Menu Items", value: menu.length },
    { label: "Orders Today", value: todaysOrders.length },
    { label: "Revenue Today", value: `$${todaysRevenue.toFixed(2)}` },
    { label: "Total Wallet Funds", value: `$${totalWallets.toFixed(2)}` },
  ];

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "14px",
          marginBottom: "26px",
        }}
      >
        {stats.map((s) => (
          <Card key={s.label}>
            <div style={{ fontSize: "0.8rem", color: "#8a8a8a", fontWeight: 600, marginBottom: "6px" }}>
              {s.label}
            </div>
            <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "var(--navy)" }}>{s.value}</div>
          </Card>
        ))}
      </div>
      <Card>
        <h3 style={{ marginBottom: "14px", color: "var(--navy)" }}>Recent Orders</h3>
        {orders.length === 0 ? (
          <EmptyState title="No orders yet" subtitle="Orders will appear here once employees start ordering." />
        ) : (
          orders.slice(0, 6).map((o) => <OrderRow key={o.id} order={o} />)
        )}
      </Card>
    </div>
  );
}

function OrderRow({ order }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>{order.employeeName}</div>
        <div style={{ fontSize: "0.8rem", color: "#8a8a8a" }}>
          {order.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 700, color: "var(--sage)" }}>${order.total.toFixed(2)}</div>
        <div style={{ fontSize: "0.78rem", color: "#8a8a8a" }}>{order.createdAt}</div>
      </div>
    </div>
  );
}

function EmployeesTab({ employees, onAdd, onDelete, onFund }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ fName: "", lName: "", email: "", address: "", dob: "", gender: "Male" });
  const [fundAmount, setFundAmount] = useState({});

  const filtered = employees.filter((e) =>
    `${e.fName} ${e.lName}`.toLowerCase().includes(search.toLowerCase())
  );

  const submit = (e) => {
    e.preventDefault();
    if (!form.fName || !form.lName || !form.email) return;
    onAdd(form);
    setForm({ fName: "", lName: "", email: "", address: "", dob: "", gender: "Male" });
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: "260px" }} />
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Register Employee"}</Button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: "20px" }}>
          <form onSubmit={submit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Input label="First Name" value={form.fName} onChange={(e) => setForm({ ...form, fName: e.target.value })} required />
              <Input label="Last Name" value={form.lName} onChange={(e) => setForm({ ...form, lName: e.target.value })} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Input label="Date of Birth" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              <Select label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </div>
            <Button type="submit">Register</Button>
          </form>
        </Card>
      )}

      {filtered.length === 0 ? (
        <EmptyState title="No employees found" subtitle="Register an employee to get started." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
          {filtered.map((emp) => (
            <Card key={emp.id}>
              <div style={{ fontWeight: 700, color: "var(--navy)" }}>{emp.fName} {emp.lName}</div>
              <div style={{ fontSize: "0.82rem", color: "#8a8a8a", marginBottom: "10px" }}>{emp.email}</div>
              <Badge tone="success">Wallet: ${emp.wallet.toFixed(2)}</Badge>
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <input
                  type="number"
                  placeholder="Amount"
                  value={fundAmount[emp.id] || ""}
                  onChange={(e) => setFundAmount({ ...fundAmount, [emp.id]: e.target.value })}
                  style={{ width: "90px", padding: "6px 8px", borderRadius: "6px", border: "1.5px solid var(--border)" }}
                />
                <Button
                  variant="success"
                  onClick={() => {
                    const amt = parseFloat(fundAmount[emp.id]);
                    if (amt > 0) {
                      onFund(emp.id, amt);
                      setFundAmount({ ...fundAmount, [emp.id]: "" });
                    }
                  }}
                >
                  Fund
                </Button>
              </div>
              <button
                onClick={() => onDelete(emp.id)}
                style={{ marginTop: "10px", background: "none", border: "none", color: "var(--clay)", fontSize: "0.8rem", cursor: "pointer", padding: 0 }}
              >
                Remove employee
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuTab({ menu, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", desc: "", category: "Main Course", image: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    onAdd({ ...form, price: parseFloat(form.price) });
    setForm({ name: "", price: "", desc: "", category: "Main Course", image: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Add Menu Item"}</Button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: "20px" }}>
          <form onSubmit={submit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Input label="Item Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Price ($)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
              <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <Input label="Description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            <Button type="submit">Add Item</Button>
          </form>
        </Card>
      )}

      <div style={{ display: "grid", gap: "10px" }}>
        {menu.map((item) => (
          <Card key={item.id} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            {item.image && (
              <img src={item.image} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "var(--navy)" }}>{item.name}</div>
              <div style={{ fontSize: "0.8rem", color: "#8a8a8a" }}>{item.category} · ${item.price.toFixed(2)}</div>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              style={{ background: "none", border: "1.5px solid var(--clay)", color: "var(--clay)", borderRadius: "8px", padding: "6px 14px", cursor: "pointer" }}
            >
              Remove
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OrdersTab({ orders }) {
  if (orders.length === 0) {
    return <EmptyState title="No orders yet" subtitle="Orders placed by employees will show up here." />;
  }
  return (
    <Card>
      {orders.map((o) => (
        <OrderRow key={o.id} order={o} />
      ))}
    </Card>
  );
}
