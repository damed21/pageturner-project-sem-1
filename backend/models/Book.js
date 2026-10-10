const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    publishedYear: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        user: {
          type: String,
          required: true,
        },

        text: {
          type: String,
          required: true,
        },

        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);