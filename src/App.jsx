import { useState } from "react";
import "./App.css";

import Login from "./Login";
import AdminDashboard from "./AdminDashboard";

// ================= BOOK IMAGES =================

import enchantmentImage from "./assets/book/enchantment of raven.jpg";
import notQuietImage from "./assets/book/not quiet at dead.jpg";
import shadowImage from "./assets/book/shawddow me.jpg";
import silentPatientImage from "./assets/book/silent patient.jpg";
import sixCrowsImage from "./assets/book/six crows.jpg";
import sorceryImage from "./assets/book/sorcery of thorns.webp";
import housemaidImage from "./assets/book/the housemaid.webp";
import zodiacImage from "./assets/book/zodiac academy.webp";

// ================= BOOK DATA =================

const books = [
  {
    id: 1,
    title: "An Enchantment of Ravens",
    author: "Margaret Rogerson",
    category: "Young Adult Fantasy",
    year: 2017,
    image: enchantmentImage,
    description:
      "Isobel is a talented portrait artist who paints the immortal faerie folk. When she paints Rook, a mysterious faerie prince, she finds herself caught between the human world and the dangerous faerie courts.",
  },

  {
    id: 2,
    title: "Not Quite Dead",
    author: "TBD",
    category: "Mystery",
    year: 2020,
    image: notQuietImage,
    description:
      "A mysterious story filled with secrets, unexpected twists, and questions surrounding a suspicious death.",
  },

  {
    id: 3,
    title: "Shatter Me",
    author: "Tahereh Mafi",
    category: "Young Adult Fantasy",
    year: 2011,
    image: shadowImage,
    description:
      "Juliette has a deadly touch. Locked away because of her dangerous ability, she discovers that her power may be more important than she ever imagined.",
  },

  {
    id: 4,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Psychological Thriller",
    year: 2019,
    image: silentPatientImage,
    description:
      "Alicia Berenson shoots her husband and then never speaks another word. Theo Faber, a psychotherapist, becomes determined to uncover the truth behind her silence.",
  },

  {
    id: 5,
    title: "Six of Crows",
    author: "Leigh Bardugo",
    category: "Young Adult Fantasy",
    year: 2015,
    image: sixCrowsImage,
    description:
      "Six dangerous outcasts are brought together for an impossible heist. Each has their own skills, secrets, and reasons for taking the risk.",
  },

  {
    id: 6,
    title: "Sorcery of Thorns",
    author: "Margaret Rogerson",
    category: "Young Adult Fantasy",
    year: 2019,
    image: sorceryImage,
    description:
      "Elisabeth Scrivener has spent her life surrounded by magical grimoires. When a dangerous magical incident occurs, she is forced to work with the sorcerer Nathaniel Thorn and his mysterious servant Silas.",
  },

  {
    id: 7,
    title: "The Housemaid",
    author: "Freida McFadden",
    category: "Psychological Thriller",
    year: 2022,
    image: housemaidImage,
    description:
      "Millie takes a job as a housemaid for a wealthy family. But she soon realizes that the family has dark secrets of their own.",
  },

  {
    id: 8,
    title: "Zodiac Academy",
    author: "Caroline Peckham & Susanne Valenti",
    category: "Young Adult Fantasy",
    year: 2019,
    image: zodiacImage,
    description:
      "Two twins discover that they are heirs to a magical kingdom and are sent to Zodiac Academy, where they must learn to control their powers while dealing with dangerous rivals.",
  },
];

// ================= APP =================

function App() {
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
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ================= LOGIN =================

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);

    localStorage.setItem(
      "pageturnerUser",
      JSON.stringify(loggedInUser)
    );

    setShowLogin(false);
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("pageturnerUser");
    setUser(null);
    setShowLogin(false);
  };

  // ================= LOGIN PAGE =================

  if (showLogin) {
    return (
      <Login
        onLogin={handleLogin}
        onBack={() => setShowLogin(false)}
      />
    );
  }

  // ================= ADMIN PAGE =================

  if (user && user.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // ================= FILTER BOOKS =================

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          📖 PageTurner
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#books">Books</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-right">

          {user ? (
            <>
              <span className="welcome-user">
                Hi, {user.name}
              </span>

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-btn"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          )}

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section className="hero" id="home">

        <div className="hero-content">

          <p className="hero-small">
            YOUR NEXT GREAT READ
          </p>

          <h1>
            Discover stories
            <br />
            <span>worth reading.</span>
          </h1>

          <p className="hero-description">
            Explore a carefully selected collection of books,
            discover new stories, and find your next favorite read.
          </p>

          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search books or authors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

      </section>

      {/* ================= BOOKS ================= */}

      <section className="books-section" id="books">

        <div className="section-header">

          <div>

            <p className="section-small">
              EXPLORE
            </p>

            <h2>
              Featured Books
            </h2>

          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >

            <option value="All">
              All Categories
            </option>

            <option value="Young Adult Fantasy">
              Young Adult Fantasy
            </option>

            <option value="Psychological Thriller">
              Psychological Thriller
            </option>

            <option value="Mystery">
              Mystery
            </option>

            <option value="Romance">
              Romance
            </option>

          </select>

        </div>

        {/* ================= BOOK GRID ================= */}

        <div className="book-grid">

          {filteredBooks.length > 0 ? (

            filteredBooks.map((book) => (

              <div
                className="book-card"
                key={book.id}
                onClick={() => setSelectedBook(book)}
              >

                <div className="book-image">

                  <img
                    src={book.image}
                    alt={book.title}
                  />

                </div>

                <div className="book-info">

                  <p className="book-category">
                    {book.category}
                  </p>

                  <h3>
                    {book.title}
                  </h3>

                  <p className="book-author">
                    {book.author}
                  </p>

                  <p className="book-year">
                    {book.year}
                  </p>

                </div>

              </div>

            ))

          ) : (

            <div className="no-books">

              <h3>
                No books found
              </h3>

              <p>
                Try searching for another book or author.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* ================= CATEGORIES ================= */}

      <section
        className="categories-section"
        id="categories"
      >

        <div className="section-header">

          <div>

            <p className="section-small">
              BROWSE BY MOOD
            </p>

            <h2>
              Categories
            </h2>

          </div>

        </div>

        <div className="category-grid">

          <button
            onClick={() =>
              setCategory("Young Adult Fantasy")
            }
          >

            <span>✨</span>

            <h3>
              Young Adult Fantasy
            </h3>

            <p>
              Magic, adventure and unforgettable worlds.
            </p>

          </button>

          <button
            onClick={() =>
              setCategory("Psychological Thriller")
            }
          >

            <span>🧠</span>

            <h3>
              Psychological Thriller
            </h3>

            <p>
              Dark stories that keep you guessing.
            </p>

          </button>

          <button
            onClick={() =>
              setCategory("Mystery")
            }
          >

            <span>🔎</span>

            <h3>
              Mystery
            </h3>

            <p>
              Secrets, clues and unexpected twists.
            </p>

          </button>

          <button
            onClick={() =>
              setCategory("Romance")
            }
          >

            <span>❤️</span>

            <h3>
              Romance
            </h3>

            <p>
              Stories about love and relationships.
            </p>

          </button>

        </div>

      </section>

      {/* ================= AI SECTION ================= */}

      <section className="ai-section">

        <div className="ai-content">

          <p className="section-small">
            COMING SOON
          </p>

          <h2>
            Not sure what to read?
          </h2>

          <p>
            Our AI-powered recommendation assistant will
            help you discover books based on your interests,
            mood and favorite stories.
          </p>

          <button className="ai-button">
            ✨ Talk to PageTurner AI
          </button>

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section
        className="about-section"
        id="about"
      >

        <div className="about-content">

          <p className="section-small">
            ABOUT PAGETURNER
          </p>

          <h2>
            A place for every story.
          </h2>

          <p>
            PageTurner is an online library created to make
            discovering books simple and enjoyable. Browse
            different genres, explore new authors and find
            stories that match your interests.
          </p>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-logo">
          📖 PageTurner
        </div>

        <p>
          Discover stories worth reading.
        </p>

        <p className="copyright">
          © 2026 PageTurner. All rights reserved.
        </p>

      </footer>

      {/* ================= BOOK DETAILS MODAL ================= */}

      {selectedBook && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedBook(null)}
        >

          <div
            className="book-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setSelectedBook(null)}
            >
              ×
            </button>

            <div className="modal-content">

              <img
                src={selectedBook.image}
                alt={selectedBook.title}
              />

              <div className="modal-info">

                <p className="book-category">
                  {selectedBook.category}
                </p>

                <h2>
                  {selectedBook.title}
                </h2>

                <h4>
                  {selectedBook.author}
                </h4>

                <p className="modal-year">
                  Published: {selectedBook.year}
                </p>

                <p className="modal-description">
                  {selectedBook.description}
                </p>

                <button
                  className="modal-close-button"
                  onClick={() => setSelectedBook(null)}
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;