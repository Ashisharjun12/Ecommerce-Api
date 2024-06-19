# Ecommerce API

## Overview

The Ecommerce API is a backend service for managing ecommerce operations, including product listings, user accounts, order processing, and more. This API is built using Node.js and Express, and it leverages MongoDB for data storage.

## Features

- User Authentication and Authorization
- Product Management (CRUD operations)
- Order Management
- Shopping Cart Functionality
- Category Management
- Payment Processing

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Products](#products)
  - [Orders](#orders)
  - [Cart](#cart)
  - [Categories](#categories)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Ashisharjun12/Ecommerce-Api.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Ecommerce-Api
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Set up the environment variables (see [Environment Variables](#environment-variables) section).

5. Start the server:
    ```bash
    npm start
    ```

## Usage

Once the server is running, you can access the API at `http://localhost:3000`. Use tools like Postman or cURL to interact with the endpoints.

## API Endpoints

### Authentication

- **Register**
    - `POST /api/auth/register`
    - Request body: 
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```

- **Login**
    - `POST /api/auth/login`
    - Request body: 
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

### Users

- **Get User**
    - `GET /api/users/:userId`
    - Headers: 
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Products

- **Get All Products**
    - `GET /api/products`

- **Get Product by ID**
    - `GET /api/products/:productId`

- **Create Product**
    - `POST /api/products`
    - Request body: 
    ```json
    {
      "name": "string",
      "price": "number",
      "description": "string",
      "category": "string"
    }
    ```
    - Headers: 
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Update Product**
    - `PUT /api/products/:productId`
    - Request body: 
    ```json
    {
      "name": "string",
      "price": "number",
      "description": "string",
      "category": "string"
    }
    ```
    - Headers: 
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Delete Product**
    - `DELETE /api/products/:productId`
    - Headers: 
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Orders

- **Create Order**
    - `POST /api/orders`
    - Request body: 
    ```json
    {
      "userId": "string",
      "products": [
        {
          "productId": "string",
          "quantity": "number"
        }
      ]
    }
    ```
    - Headers: 
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Get Order by ID**
    - `GET /api/orders/:orderId`
    - Headers: 
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Cart

- **Add to Cart**
    - `POST /api/cart`
    - Request body: 
    ```json
    {
      "userId": "string",
      "productId": "string",
      "quantity": "number"
    }
    ```
    - Headers: 
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Get Cart**
    - `GET /api/cart/:userId`
    - Headers: 
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

- **Remove from Cart**
    - `DELETE /api/cart/:userId/:productId`
    - Headers: 
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

### Categories

- **Get All Categories**
    - `GET /api/categories`

- **Create Category**
    - `POST /api/categories`
    - Request body: 
    ```json
    {
      "name": "string"
    }
    ```
    - Headers: 
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
