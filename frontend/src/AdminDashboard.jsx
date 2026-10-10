import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ user, onLogout, onHome }) {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    publishedYear: "",
    image: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/books";

  async function fetchBooks() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load books");
      }

      setBooks(Array.isArray(data) ? data : data.books || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not connect to the server");
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleAddBook(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !form.category ||
      !form.publishedYear ||
      !form.image.trim() ||
      !form.description.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          publishedYear: Number(form.publishedYear),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book");
      }

      setMessage("Book added successfully!");
      setForm({
        title: "",
        author: "",
        category: "",
        publishedYear: "",
        image: "",
        description: "",
      });

      await fetchBooks();
    } catch (err) {
      setError(err.message || "Failed to add book");
    }
  }

  async function handleDeleteBook(id) {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book");
      }

      setMessage("Book deleted successfully!");
      await fetchBooks();
    } catch (err) {
      setError(err.message || "Failed to delete book");
    }
  }

  const fieldStyle = {
    color: "#000000",
    backgroundColor: "#ffffff",
    WebkitTextFillColor: "#000000",
  };

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <h2 className="admin-logo">PageTurner Admin</h2>

        <div className="admin-nav-actions">
          <button type="button" onClick={onHome}>Home</button>
          <span>Hi, {user?.name || "Admin"}</span>
          <button type="button" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <main className="admin-content">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Manage your library and books.</p>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>Total Books</h3>
            <p>{books.length}</p>
          </div>

          <div className="admin-stat-card">
            <h3>Total Reviews</h3>
            <p>
              {books.reduce(
                (total, book) => total + (book.comments?.length || 0),
                0
              )}
            </p>
          </div>

          <div className="admin-stat-card">
            <h3>Account</h3>
            <p>Admin</p>
          </div>
        </div>

        <section className="admin-section">
          <h2>Add New Book</h2>

          <form className="admin-form" onSubmit={handleAddBook}>
            <div className="form-field">
              <label htmlFor="title">Book Title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter book title"
                style={fieldStyle}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="author">Author</label>
              <input
                id="author"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                style={fieldStyle}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                style={fieldStyle}
                required
              >
                <option value="">Select Category</option>
                <option value="Young Adult Fantasy">Young Adult Fantasy</option>
                <option value="Romance">Romance</option>
                <option value="Psychological Thriller">Psychological Thriller</option>
                <option value="Mystery">Mystery</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="publishedYear">Published Year</label>
              <input
                id="publishedYear"
                name="publishedYear"
                type="number"
                value={form.publishedYear}
                onChange={handleChange}
                placeholder="Enter published year"
                style={fieldStyle}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="image">Book Cover Image URL</label>
              <input
                id="image"
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="Paste image URL"
                style={fieldStyle}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">Book Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter book description"
                rows={4}
                style={fieldStyle}
                required
              />
            </div>

            <button type="submit" className="add-book-button">
              Add Book
            </button>
          </form>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </section>

        <section className="admin-section">
          <h2>Existing Books ({books.length})</h2>

          <div className="admin-books-list">
            {books.length === 0 ? (
              <p>No books available yet.</p>
            ) : (
              books.map((book) => (
                <div className="admin-book-card" key={book._id}>
                  <img
                    src={book.image}
                    alt={book.title}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="admin-book-info">
                    <h3>{book.title}</h3>
                    <p>Author: {book.author}</p>
                    <p>Category: {book.category}</p>
                    <p>Year: {book.publishedYear}</p>
                  </div>

                  <button
                    type="button"
                    className="delete-book-button"
                    onClick={() => handleDeleteBook(book._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;