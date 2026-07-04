import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Items() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load items");
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/items", { name, category, quantity: Number(quantity) });
      setName("");
      setCategory("");
      setQuantity(1);
      loadItems();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      loadItems();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete item");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="items-page">
      <header className="items-header">
        <h1>My Household Items</h1>
        <div>
          <span className="welcome">Hi, {user?.name}</span>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <form className="item-form" onSubmit={handleAdd}>
        <input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input
          type="number"
          min="1"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>

      {items.length === 0 ? (
        <p className="empty">No items yet. Add your first one above.</p>
      ) : (
        <table className="items-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category || "-"}</td>
                <td>{item.quantity}</td>
                <td>
                  <button className="danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
