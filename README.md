# Event & Performer Booking Backend API

A comprehensive RESTful API for event and performer booking platform built with Node.js, Express.js, MySQL, and Sequelize ORM.

## Features

- **Categories & Events Management**: Browse categories and events
- **Actor/Performer Listings**: Search and filter performers by tier, location, genre, etc.
- **OTP Verification**: Email-based OTP verification for secure bookings
- **Image Management**: Upload and store images as BLOBs in MySQL
- **Booking System**: Complete booking workflow with email confirmations
- **Requirements Submission**: Post event requirements with OTP verification
- **Reviews & Ratings**: Add reviews and ratings for performers
- **Search Functionality**: Search across categories, events, and actors
- **Contact Forms**: Get in touch and contact forms with email notifications

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **File Upload**: Multer (memory storage)
- **Email**: Nodemailer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
src/
├── config/
│   ├── db.js              # Database configuration
│   └── mailer.js          # Email configuration and OTP configuration
├── models/
│   ├── Actor.js           # Actor/Performer model
│   ├── ActorGallery.js    # Actor gallery images
│   ├── Category.js        # Category model
│   ├── Client.js          # Client model
│   ├── Contact.js         # Contact form model
│   ├── index.js           # Model associations
│   ├── Images.js          # Image storage model

│   ├── Event.js           # Event model
│   ├── Review.js          # Reviews model
│   ├── Requirement.js     # Requirements model
│   ├── Booking.js         # Bookings model
│   └── GetInTouch.js      # Get in touch model
├── controllers/
│   ├── actorController.js
│   ├── bookingController.js
│   ├── categoryController.js
│   ├── contactController.js
│   ├── imageController.js
│   ├── otpController.js
│   ├── requirementController.js
│   └── searchController.js
├── routes/
│   ├── actors.js
│   ├── bookings.js
│   ├── categories.js
│   ├── contact.js
│   ├── images.js
│   ├── requirements.js
│   └── search.js
├── services/
│   ├── imageService.js    # Multer configuration & image handling
│   ├── otpService.js      # OTP generation & verification
│   ├── mailService.js     # Email templates & sending
│   └── searchService.js   # Search logic
├── middleware/
│   ├── errorHandler.js    # Global error handler
│   ├── rateLimiter.js     # Rate limiting middleware
│   └── validation.js      # Request validation schemas
├── app.js                 # Express app configuration
└── server.js              # Server entry point
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your MySQL and SMTP credentials

## Configuration

### Database Configuration

Update the following in `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=booking_db
DB_USER=root
DB_PASSWORD=your_password
```

### Email Configuration

Configure SMTP settings in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM_NAME=Booking Platform
ADMIN_EMAIL=admin@example.com
```

For Gmail, you'll need to:
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password in SMTP_PASSWORD

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Categories
- `GET /categories` - List all categories
- `GET /categories/:id/events` - List events by category
- `GET /categories/:id/actors` - List actors by category (with filters)

### Actors/Performers
- `GET /actors` - List all actors (with filters)
- `GET /actors/:id` - Get actor details with gallery and reviews
- `POST /actors/:id/gallery` - Upload gallery images (multipart/form-data)
- `POST /actors/:id/reviews` - Add a review

### Bookings
- `POST /actors/:id/book/otp-request` - Request OTP for booking
- `POST /actors/:id/book/verify-otp` - Verify OTP
- `POST /actors/:id/book` - Submit booking (requires verified OTP)

### Requirements
- `POST /requirements/otp-request` - Request OTP
- `POST /requirements/verify-otp` - Verify OTP
- `POST /requirements` - Submit requirement (requires verified OTP)

### Contact
- `POST /contact` - Submit contact form
- `POST /contact/get-in-touch/otp-request` - Request OTP
- `POST /contact/get-in-touch/verify-otp` - Verify OTP
- `POST /contact/get-in-touch` - Submit get in touch form

### Search
- `GET /search?q=query&type=actors|events|categories&page=1&limit=10` - Search

### Images
- `GET /images/:id` - Retrieve image by ID

## API Usage Examples

### 1. Browse Categories
```bash
curl http://localhost:3000/categories
```

### 2. Request OTP for Booking
```bash
curl -X POST http://localhost:3000/actors/1/book/otp-request \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "purpose": "booking"
  }'
```

### 3. Verify OTP
```bash
curl -X POST http://localhost:3000/actors/1/book/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456",
    "purpose": "booking"
  }'
```

### 4. Submit Booking
```bash
curl -X POST http://localhost:3000/actors/1/book \
  -H "Content-Type: application/json" \
  -d '{
    "occasions": "Wedding",
    "eventDate": "2025-12-25",
    "city": "New York",
    "noOfAttendees": 150,
    "budget": 5000,
    "fullName": "John Doe",
    "email": "user@example.com",
    "mobileNumber": "+1234567890",
    "additionalInfo": "Evening event"
  }'
```

### 5. Upload Gallery Images
```bash
curl -X POST http://localhost:3000/actors/1/gallery \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

### 6. Search
```bash
curl "http://localhost:3000/search?q=singer&type=actors&page=1&limit=10"
```

## Filter Parameters

### Actor Filters
- `tier`: Premium | Standard | Basic
- `gender`: Male | Female | Other
- `genre`: Any genre
- `language`: Any language
- `eventType`: Any event type
- `city`: Any city
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

## Security Features

- **Rate Limiting**:
  - OTP requests: 5 per hour
  - Authentication: 10 per 15 minutes
  - General API: 100 per 15 minutes
- **Input Validation**: All inputs validated with express-validator
- **Input Sanitization**: Email normalization, string trimming
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing enabled
- **Prepared Statements**: Sequelize prevents SQL injection

## Image Management

- Images are stored as LONGBLOB in MySQL
- Maximum file size: 5MB
- Supported formats: JPEG, PNG, GIF, WebP
- Images served with proper caching headers (1 year)
- ETag support for efficient caching

## OTP Flow

1. Request OTP (valid for 5 minutes)
2. Receive OTP via email
3. Verify OTP within expiry time
4. Submit form within 10 minutes of verification
5. Automatic cleanup of expired OTPs

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Additional details"]
}
```

## Database Schema

The application automatically syncs database schema in development mode. Tables include:
- images
- categories
- events
- actors
- actor_gallery
- reviews
- user_otps
- requirements
- bookings
- contacts
- get_in_touch

## Notes

- MySQL server must be running before starting the application
- Database tables are auto-created in development mode
- Email functionality requires valid SMTP credentials
- Images are stored in database (no file system storage)
- OTP verification is required for all booking and requirement submissions

## License

This project is private and proprietary.
