import React, { useState } from "react";
import Landing from "./components/Landing";
import AdminPortal from "./components/AdminPortal";
import EmployeePortal from "./components/EmployeePortal";

function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return <Landing onSelectRole={setRole} />;
  }

  if (role === "ADMIN") {
    return <AdminPortal onLogout={() => setRole(null)} />;
  }

  return <EmployeePortal onLogout={() => setRole(null)} />;
}

export default App;
