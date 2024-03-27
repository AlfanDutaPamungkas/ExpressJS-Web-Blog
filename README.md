# Web Blog App

This is a web blog application built using Express.js

## Features

- User Authentication and Authorization: Users can register, login, and logout. Only logged-in users can create, update, and delete their own blog posts and comments.
- Blog Post Management: Users can create, update, and delete their own blog posts.
- Comment Management: Users can leave comments on blog posts and update or delete their own comments.
- Read-only Access for Guests: Guests can read blog posts but cannot create, update, or delete them.

## Technologies Used

- Express.js
- MongoDB
- HTML
- CSS
- EJS

## Getting Started

To get started with the application, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up the MongoDB connection in the `config/dbConnet.js` file.
4. Set up the cloudinary in the `cloudinary_config.js` file
5. Run the application using `npm server` or `npm --watch server`.

## Usage

1. Register or login to access the full features of the application.
2. Create a new blog post by clicking on the "Create Post" button.
3. Leave a comment on a blog post by filling out the comment form.
4. Update or delete your own blog posts and comments by navigating to the respective edit or delete buttons.