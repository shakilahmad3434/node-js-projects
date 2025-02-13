# Short URL Generator

A simple URL shortener built using **Node.js** and **MongoDB** that generates short, shareable URLs.

## Features

- Generate a short URL from a long URL
- Redirect to the original URL using the short URL
- Store and manage URL mappings in MongoDB
- Basic analytics for URL clicks

## Technologies Used

- **Node.js** - Backend runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database for storing URLs
- **Mongoose** - ODM for MongoDB
- **Nanoid** - Library for generating short, unique IDs

## API Endpoints

### 1. Shorten a URL
- **Endpoint:** `POST /url`
- **Request Body:**
  ```json
  {
    "longUrl": "https://example.com/very-long-url"
  }
  ```
- **Response:**
  ```json
  {
    "shortUrl": "http://localhost:5000/abc123"
  }
  ```

### 2. Redirect to Original URL
- **Endpoint:** `GET /:shortId`
- **Example:** `GET http://localhost:5000/abc123` redirects to `https://example.com/very-long-url`

## Project Structure

```
short-url-generator/
├── models/
│   ├── Url.js
├── routes/
│   ├── urlRoutes.js
├── server.js
├── package.json
├── .env
├── README.md
```

## License

This project is open-source and available under the [MIT License](LICENSE).

