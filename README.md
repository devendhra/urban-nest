# 🏠 Urban Nest - Full Stack Real Estate Platform

A comprehensive MERN stack application for property listings, management, and real estate services. Built with modern technologies and designed for seamless user experience in finding, managing, and contacting about properties.

## 👨‍💻 Developer

**Devendhra A** - Full Stack Developer

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login**: Secure user authentication with JWT tokens
- **Admin Dashboard**: Dedicated admin panel for property management
- **Profile Management**: Update user information and preferences
- **Role-based Access**: Different permissions for admin and regular users

### 🏡 Property Management
- **Property Listings**: Browse and search properties with advanced filters
- **Property Details**: Comprehensive property information with image galleries
- **Create Properties**: Admin can add new property listings
- **Edit Properties**: Update existing property information
- **Image Upload**: Multiple image support for property galleries

### 📧 Communication
- **Contact Property Owners**: Direct messaging system for property inquiries
- **General Contact Form**: Contact the platform administrators
- **Email Notifications**: Automated email sending for inquiries

### 🎨 User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI Components**: Built with Next.js and React
- **Interactive Elements**: Smooth animations and transitions
- **Image Galleries**: Professional property image displays

### 🔧 Additional Features
- **PDF Generation**: Generate property reports and documents
- **File Upload**: Secure file handling with Multer
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Robust error management and user feedback

## 🛠 Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework for production
- **React 19.2.3** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library
- **Leaflet** - Interactive maps

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending service
- **Multer** - File upload middleware
- **PDFKit** - PDF generation

### DevOps & Tools
- **Git** - Version control
- **npm** - Package management
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/devendhra/urban-nest.git
cd urban-nest
```

### 2. Backend Setup
```bash
cd server
npm install
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

## 🔧 Environment Setup

### Backend Environment Variables (server/.env)
Create a `.env` file in the server directory with the following variables:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/urban_nest
# Or for MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/urban_nest

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Server
PORT=5000
```

### Frontend Environment Variables (client/.env.local)
Create a `.env.local` file in the client directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend Server:**
```bash
cd server
npm start
```
The server will start on `http://localhost:5000`

2. **Start Frontend Development Server:**
```bash
cd client
npm run dev
```
The frontend will be available at `http://localhost:3000`

### Production Build

1. **Build Frontend:**
```bash
cd client
npm run build
npm start
```

2. **Backend Production:**
```bash
cd server
npm start
```

## 📡 API Endpoints

### Authentication Routes
- `POST /api/login` - User login
- `POST /api/signup` - User registration

### Property Routes
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property (Admin)
- `PUT /api/properties/:id` - Update property (Admin)
- `DELETE /api/properties/:id` - Delete property (Admin)

### User Routes
- `GET /api/dashboard` - Get user dashboard data
- `PUT /api/update-profile` - Update user profile

### Communication Routes
- `POST /api/contact` - General contact form
- `POST /api/contact-owner` - Contact property owner

### Additional Routes
- `POST /api/forgot-password` - Password reset request
- `POST /api/reset-password` - Reset password with token
- `POST /api/booking` - Book property viewing
- `GET /api/generate-pdf/:id` - Generate property PDF

## 📁 Project Structure

```
urban-nest/
├── client/                          # Frontend Application
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── admin/               # Admin dashboard
│   │   │   ├── booking/             # Property booking
│   │   │   ├── contact-owner/       # Contact property owner
│   │   │   ├── create-property/     # Add new properties
│   │   │   ├── dashboard/           # User dashboard
│   │   │   ├── edit-property/       # Edit properties
│   │   │   ├── env/                 # Environment debug
│   │   │   ├── forgot-password/     # Password reset
│   │   │   ├── login/               # User login
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── properties/          # Property listings
│   │   │   ├── property/            # Property details
│   │   │   ├── reset-password/      # Reset password
│   │   │   ├── signup/              # User registration
│   │   │   ├── update-profile/      # Profile management
│   │   │   └── layout.tsx           # Root layout
│   │   ├── lib/                     # Utility functions
│   │   └── components.json          # Component configuration
│   ├── public/                      # Static assets
│   │   └── images/                  # Image assets
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.ts
├── server/                          # Backend Application
│   ├── controllers/                 # Route controllers
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   ├── pdfController.js
│   │   └── propertyController.js
│   ├── middleware/                  # Custom middleware
│   ├── models/                      # MongoDB models
│   │   ├── Property.js
│   │   └── User.js
│   ├── routes/                      # API routes
│   │   ├── auth.js
│   │   ├── booking.js
│   │   ├── contact.js
│   │   ├── contactOwnerRoutes.js
│   │   ├── pdfRoutes.js
│   │   ├── property.js
│   │   ├── resetPasswordRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/                     # File uploads
│   ├── utils/                       # Utility functions
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── server.js                    # Main server file
├── .gitignore
├── LICENSE
└── README.md
```

## 💡 Usage

### For Regular Users:
1. **Browse Properties**: Visit the homepage and explore available properties
2. **View Details**: Click on any property to see detailed information and images
3. **Contact Owners**: Use the contact form to send inquiries to property owners
4. **User Account**: Register/login to access additional features

### For Administrators:
1. **Login**: Use admin credentials to access the admin dashboard
2. **Manage Properties**: Add, edit, or delete property listings
3. **View Analytics**: Monitor platform usage and property performance
4. **User Management**: Manage user accounts and permissions

### Key Features Walkthrough:

1. **Property Search & Discovery**
   - Browse properties on the main listings page
   - Filter by location, price, type, and amenities
   - View detailed property information with image galleries

2. **Contact & Communication**
   - Use contact forms to reach property owners
   - General contact form for platform inquiries
   - Email notifications for all communications

3. **Admin Panel**
   - Comprehensive dashboard for property management
   - Add new properties with multiple images
   - Edit existing property information
   - Generate PDF reports for properties

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines:
- Follow the existing code style and structure
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Devendhra A**

For questions or support, please contact: devendhra@example.com
