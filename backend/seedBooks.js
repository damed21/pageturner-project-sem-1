const mongoose = require("mongoose");
require("dotenv").config();

const Book = require("./models/Book");

const books = [
  {
    title: "An Enchantment of Ravens",
    author: "Margaret Rogerson",
    category: "Fantasy",
    description:
      "A magical fantasy story about a talented portrait artist and the mysterious world of the fair folk.",
    publishedYear: 2017,
    image: "https://covers.openlibrary.org/b/title/An%20Enchantment%20of%20Ravens-L.jpg",
  },

  {
    title: "Sorcery of Thorns",
    author: "Margaret Rogerson",
    category: "Fantasy",
    description:
      "A magical adventure involving enchanted grimoires, a young librarian, and a mysterious sorcerer.",
    publishedYear: 2019,
    image: "https://covers.openlibrary.org/b/title/Sorcery%20of%20Thorns-L.jpg",
  },

  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Thriller",
    description:
      "A psychological thriller about a famous painter who stops speaking after being accused of murdering her husband.",
    publishedYear: 2019,
    image: "https://covers.openlibrary.org/b/title/The%20Silent%20Patient-L.jpg",
  },

  {
    title: "The Cruel Prince",
    author: "Holly Black",
    category: "Fantasy",
    description:
      "A dark fantasy about a human girl navigating the dangerous and deceptive world of the faerie court.",
    publishedYear: 2018,
    image: "https://covers.openlibrary.org/b/title/The%20Cruel%20Prince-L.jpg",
  },

  {
    title: "A Good Girl's Guide to Murder",
    author: "Holly Jackson",
    category: "Mystery",
    description:
      "A determined student investigates a closed murder case and discovers secrets that someone wants to keep hidden.",
    publishedYear: 2019,
    image:
      "https://covers.openlibrary.org/b/title/A%20Good%20Girl's%20Guide%20to%20Murder-L.jpg",
  },

  {
    title: "The Inheritance Games",
    author: "Jennifer Lynn Barnes",
    category: "Mystery",
    description:
      "A teenage girl unexpectedly inherits a fortune and must solve a series of puzzles to uncover why she was chosen.",
    publishedYear: 2020,
    image: "https://covers.openlibrary.org/b/title/The%20Inheritance%20Games-L.jpg",
  },

  {
    title: "Six of Crows",
    author: "Leigh Bardugo",
    category: "Fantasy",
    description:
      "A group of unlikely criminals comes together for an impossible heist in a dangerous fantasy world.",
    publishedYear: 2015,
    image: "https://covers.openlibrary.org/b/title/Six%20of%20Crows-L.jpg",
  },

  {
    title: "The Housemaid",
    author: "Freida McFadden",
    category: "Thriller",
    description:
      "A psychological thriller about a housemaid who discovers disturbing secrets inside the wealthy home where she works.",
    publishedYear: 2022,
    image: "https://covers.openlibrary.org/b/title/The%20Housemaid-L.jpg",
  },
];

async function seedBooks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected!");

    await Book.deleteMany({});

    await Book.insertMany(books);

    console.log("8 books added successfully!");

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  } catch (error) {
    console.log("Error:", error.message);
  }
}

seedBooks();