# Fullstack eCommerce Project

This project is a fullstack eCommerce platform that allows users to browse, purchase, and manage products. The application is split into two main components: the **backend** (ecommerce-backend) and the **frontend** (ecommerce-frontend). The backend serves as the API layer, handling authentication, product management, and orders, while the frontend offers a smooth user interface to interact with the platform.

## Features

- **Authentication**: Secure login and registration for users.
- **Product Management**: Admins and sellers can add, edit, and remove products.
- **Order Management**: Users can create and track orders.
- **Image Serving**: Product images are managed and served efficiently.
- **Global State Management**: Frontend state is managed using Redux.
- **Role-Based Authorization**: Different access levels for admins, sellers, and users.

## Tech Stack

### Backend (ecommerce-backend)
- **Node.js** with **Express**: Provides RESTful APIs for the frontend, serves the frontend as well in production mode.
- **SQLite**: Lightweight database for storing user, product, and order data.
- **Sequelize**: ORM used for database interactions.
- **JWT Authentication**: Secures routes and ensures that only authenticated users can access certain resources.
- **Multer**: Handles image uploads for products.

### Frontend (ecommerce-frontend)
- **React.js**: Frontend library for building a responsive UI.
- **Redux**: Manages global state across the application.
- **Tailwind CSS**: For fast and efficient styling.
- **Vite**: Provides fast build and development for the React app.

## Project Structure

### Backend (`/ecommerce-backend`)

- `/controllers`: Handles the business logic for authentication, products, orders, and users.
- `/database`: Contains the SQLite database and configurations.
- `/middleware`: Includes authentication and authorization logic.
- `/models`: Sequelize models for database interactions.
- `/routes`: Defines API endpoints for different functionalities.
- `/dist`: `vite build` output folder for frontend builds, served using `express` in production mode.
- `server.js`: Entry point for backend. Creates an express server to serve the API routes and the frontend.

### Frontend (`/ecommerce-frontend`)

- `/src`: Main source folder for the React app.
  - `/app`: Contains Redux slices and store setup.
  - `/components`: Reusable React components (e.g., Navbar, Forms, Product listing).
  - `/pages`: Pages for different parts of the app (e.g., Home, Product, Orders).
  - `/utils`: Helper functions and hooks (e.g., navigation, authentication redirection).

## How to Run the Project

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v20 or higher)
- npm (v10 or higher)

### Setup

1. Clone the project and hop into the project root:
```bash
git clone https://github.com/AdNarayan07/eCommerce.git
cd eCommerce
```
2. Create a `./ecommerce-backend/.env` file with following content:
```env
JWT_SECRET=YOUR_JWT_SECRET
ROOT_PASSWORD=PASSWORD_FOR_@root_USER
```
3. Initialise the project:
```bash
npm run initialise
```
this will install all the dependencies in root, frontend and backend directories.
4. 
  - To run the application in development mode, run following command in root directory:
```bash
npm run start:dev
```
    This will start the backend API server on port 3000 and frontend `vite` server on port 5173 simultaneously using `concurrently`.
  - To run the application in production mode, run following command in root directory:
```bash
npm run start:prod
```
    This will first `vite build` the frontend code in `./ecommerce-backend/dist` folder and then run the backend server on port 3000, the frontend and API both will be served throgh the same server. We can then upload the `./ecommerce-backend` folder on a web hosting platform like this: https://adnarayan-ecommerce.onrender.com/

## Global State Management with Redux
The global state of the application is managed using **Redux**. This ensures smooth state management across different parts of the frontend application. State slices such as `authSlice`, `productsSlice`, and `transitionSlice` are used to manage authentication, product listings, and transitions respectively.

