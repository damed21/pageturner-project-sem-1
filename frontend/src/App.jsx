import { useState, useEffect } from "react";
import "./App.css";

import Login from "./Login";
import AdminDashboard from "./AdminDashboard";

function App() {
  // ================= USER =================

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("pageturnerUser");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }

    return null;
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // ================= BOOKS =================

  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [selectedBook, setSelectedBook] = useState(null);

  // ================= REVIEW =================

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

// ================= GET BOOKS =================

const fetchBooks = async () => {
  try {
    const response = await fetch(
      "https://pageturner-g78w.onrender.com/api/books"
    );

    if (!response.ok) {
      throw new Error(`Failed to load books: ${response.status}`);
    }

    const data = await response.json();

    setBooks(Array.isArray(data) ? data : data.books || []);
  } catch (error) {
    console.error("Error loading books:", error);
  }
};

useEffect(() => {
  fetchBooks();
}, []);
 
  

  // ================= CATEGORIES =================

  const categories = [
    "All",
    "Young Adult Fantasy",
    "Romance",
    "Psychological Thriller",
    "Mystery",
  ];

  // ================= FILTER BOOKS =================

  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      book.title?.toLowerCase().includes(searchText) ||
      book.author?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      book.category?.includes(category);

    return matchesSearch && matchesCategory;
  });

  // ================= LOGIN =================

  const handleLogin = (loggedInUser) => {
    const updatedUser = {
      ...loggedInUser,

      role:
        loggedInUser.email?.toLowerCase() ===
        "admin@pageturner.com"
          ? "admin"
          : loggedInUser.role,
    };

    setUser(updatedUser);

    localStorage.setItem(
      "pageturnerUser",
      JSON.stringify(updatedUser)
    );

    setShowLogin(false);

    if (updatedUser.role === "admin") {
      setShowAdmin(true);
    }
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    setUser(null);
    setShowLogin(false);
    setShowAdmin(false);
    setSelectedBook(null);

    localStorage.removeItem("pageturnerUser");
    localStorage.removeItem("pageTurnerUser");
  };

  // ================= OPEN BOOK =================

  const openBookDetails = (book) => {
    setSelectedBook(book);

    setRating(0);
    setReviewText("");
    setReviewMessage("");
    setReviewError("");
  };

  // ================= CLOSE BOOK =================

  const closeBookDetails = () => {
    setSelectedBook(null);

    setRating(0);
    setReviewText("");
    setReviewMessage("");
    setReviewError("");
  };

  // ================= SUBMIT REVIEW =================

  const handleSubmitReview = async () => {
    if (!user) {
      setReviewError(
        "Please login to rate and review this book."
      );
      return;
    }

    if (rating === 0) {
      setReviewError(
        "Please select a rating from 1 to 5 stars."
      );
      return;
    }

    if (!reviewText.trim()) {
      setReviewError(
        "Please write a review before submitting."
      );
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError("");
      setReviewMessage("");

      const response = await fetch(
        `https://pageturner-g78w.onrender.com/api/books/${selectedBook._id}/comments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user: user.name,
            text: reviewText,
            rating: rating,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setReviewError(
          data.message || "Failed to submit review."
        );
        return;
      }

      setBooks((oldBooks) =>
        oldBooks.map((book) =>
          book._id === data._id ? data : book
        )
      );

      setSelectedBook(data);

      setRating(0);
      setReviewText("");

      setReviewMessage(
        "Your rating and review were added successfully!"
      );
    } catch (error) {
      console.error(error);

      setReviewError(
        "Unable to connect to the server."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // =========================================================
  // LOGIN PAGE
  // =========================================================

  if (showLogin) {
    return (
      <Login
        onLogin={handleLogin}
        onBack={() => setShowLogin(false)}
      />
    );
  }

  // =========================================================
  // ADMIN DASHBOARD
  // =========================================================

  if (
    showAdmin &&
    user &&
    (
      user.role === "admin" ||
      user.email?.toLowerCase() ===
        "admin@pageturner.com"
    )
  ) {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
        onHome={() => {
          setShowAdmin(false);
          fetchBooks();
        }}
      />
    );
  }

  // =========================================================
  // MAIN PAGETURNER
  // =========================================================

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          <span>📖</span>
          <span>PageTurner</span>
        </div>

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#books">
            Books
          </a>

          <a href="#categories">
            Categories
          </a>

          <a href="#about">
            About
          </a>

        </div>

        <div className="auth-buttons">

          {!user && (
            <button
              className="login-btn"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          )}

          {user && (
            <>
              <span className="welcome-user">
                Hi, {user.name}
              </span>

              {(user.role === "admin" ||
                user.email?.toLowerCase() ===
                  "admin@pageturner.com") && (
                <button
                  className="login-btn"
                  onClick={() => setShowAdmin(true)}
                >
                  Admin
                </button>
              )}

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <p className="small-heading">
            YOUR NEXT GREAT READ
          </p>

          <h1>
            Discover stories
            <span>
              worth reading.
            </span>
          </h1>

          <p className="hero-text">
            Explore a carefully selected collection
            of books, discover new stories, and find
            your next favorite read.
          </p>

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search books or authors..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

      </section>

      {/* ================= BOOKS ================= */}

      <section
        className="books-section"
        id="books"
      >

        <div className="section-heading">

          <div>

            <p className="small-heading">
              EXPLORE
            </p>

            <h2>
              Popular Books
            </h2>

          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}

          </select>

        </div>

        <div className="book-grid">

          {filteredBooks.length > 0 ? (

            filteredBooks.map((book) => (

              <div
                className="book-card"
                key={book._id}
              >

                <div className="book-image">

                  <img
                    src={book.image}
                    alt={book.title}
                  />

                </div>

                <div className="book-info">

                  <span className="category">
                    {book.category}
                  </span>

                  <h3>
                    {book.title}
                  </h3>

                  <p className="author">
                    by {book.author}
                  </p>

                  <div className="rating">

                    ⭐⭐⭐⭐⭐

                    <span>
                      {" "}
                      {book.averageRating
                        ? Number(
                            book.averageRating
                          ).toFixed(1)
                        : "No rating"}
                    </span>

                  </div>

                  <button
                    className="details-btn"
                    onClick={() =>
                      openBookDetails(book)
                    }
                  >
                    View Details
                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="no-books">

              <h3>
                No books found
              </h3>

              <p>
                Try another title, author, or category.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* ================= AI ================= */}

      <section className="ai-section">

        <div className="ai-icon">
          ✨
        </div>

        <div className="ai-content">

          <p className="small-heading">
            PAGETURNER AI
          </p>

          <h2>
            Your personal library assistant.
          </h2>

          <p>
            Ask for book recommendations, discover
            books by genre, or find your next read.
          </p>

        </div>

        <button className="ai-button">
          Ask PageTurner AI
        </button>

      </section>

      {/* ================= ABOUT ================= */}

      <section
        className="about-section"
        id="about"
      >

        <p className="small-heading">
          ABOUT PAGETURNER
        </p>

        <h2>
          A library made for readers.
        </h2>

        <p>
          PageTurner is an online library platform
          where readers can discover books, explore
          different genres, rate books, and share
          their opinions through reviews and comments.
        </p>

      </section>

      {/* ================= FOOTER ================= */}

      <footer>

        <div className="logo">

          <span>
            📖
          </span>

          <span>
            PageTurner
          </span>

        </div>

        <p>
          © 2026 PageTurner. Read. Discover. Share.
        </p>

      </footer>

      {/* =====================================================
          BOOK DETAILS
          ===================================================== */}

      {selectedBook && (

        <div
          className="modal-overlay"
          onClick={closeBookDetails}
        >

          <div
            className="book-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-btn"
              onClick={closeBookDetails}
            >
              ×
            </button>

            <img
              src={selectedBook.image}
              alt={selectedBook.title}
            />

            <div className="modal-content">

              <span className="category">
                {selectedBook.category}
              </span>

              <h2>
                {selectedBook.title}
              </h2>

              <p className="author">
                by {selectedBook.author}
              </p>

              <p>
                <strong>
                  Published:
                </strong>{" "}
                {selectedBook.publishedYear}
              </p>

              {/* PLOT */}

              <div className="plot-section">

                <h3>
                  Plot
                </h3>

                <p>
                  {selectedBook.description}
                </p>

              </div>

              {/* RATING */}

              <div className="rating-summary">

                <h3>
                  Reader Rating
                </h3>

                <div className="rating-number">

                  ⭐{" "}

                  {selectedBook.averageRating
                    ? Number(
                        selectedBook.averageRating
                      ).toFixed(1)
                    : "0.0"}

                  <span>
                    {" "}
                    / 5
                  </span>

                </div>

                <p>
                  {selectedBook.ratingCount || 0}{" "}
                  ratings
                </p>

              </div>

              {/* REVIEW */}

              <div className="review-section">

                <h3>
                  Rate & Review
                </h3>

                {!user ? (

                  <div className="login-prompt">

                    <p>
                      Login to rate and review
                      this book.
                    </p>

                    <button
                      onClick={() => {
                        closeBookDetails();
                        setShowLogin(true);
                      }}
                    >
                      Login
                    </button>

                  </div>

                ) : (

                  <>

                    <p className="rating-label">
                      Your Rating
                    </p>

                    <div className="rating-stars">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (

                          <button
                            key={star}
                            type="button"
                            className={
                              star <= rating
                                ? "star-selected"
                                : ""
                            }
                            onClick={() =>
                              setRating(star)
                            }
                          >
                            ★
                          </button>

                        )
                      )}

                    </div>

                    <textarea
                      value={reviewText}
                      onChange={(e) =>
                        setReviewText(
                          e.target.value
                        )
                      }
                      placeholder="Write your review..."
                    />

                    {reviewError && (
                      <p className="review-error">
                        {reviewError}
                      </p>
                    )}

                    {reviewMessage && (
                      <p className="review-success">
                        {reviewMessage}
                      </p>
                    )}

                    <button
                      className="review-submit"
                      onClick={
                        handleSubmitReview
                      }
                      disabled={
                        submittingReview
                      }
                    >
                      {submittingReview
                        ? "Submitting..."
                        : "Submit Review"}
                    </button>

                  </>

                )}

              </div>

              {/* EXISTING REVIEWS */}

              <div className="reviews-list">

                <h3>
                  Reader Reviews
                </h3>

                {selectedBook.comments &&
                selectedBook.comments.length > 0 ? (

                  selectedBook.comments.map(
                    (comment, index) => (

                      <div
                        className="review-item"
                        key={index}
                      >

                        <div className="review-top">

                          <strong>
                            {comment.user}
                          </strong>

                          <span>
                            {"⭐".repeat(
                              comment.rating
                            )}
                          </span>

                        </div>

                        <p>
                          {comment.text}
                        </p>

                      </div>

                    )
                  )

                ) : (

                  <p className="no-reviews">
                    No reviews yet. Be the first
                    to review this book!
                  </p>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;