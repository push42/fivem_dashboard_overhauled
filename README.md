# FiveM Admin Dashboard 2.0

> A modern, fully-featured admin dashboard for FiveM servers built with React 18, PHP 8+, and modern best practices.

## 🚀 Features

- **Modern React Frontend**: Built with React 18, React Query, and React Router
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live chat, server status, and user activity monitoring
- **Task Management**: Advanced todo system with completion tracking
- **User Management**: Role-based authentication and user controls
- **Server Monitoring**: Real-time server status and player count
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Security**: JWT authentication, input validation, and SQL injection protection
- **Performance**: Optimized bundle sizes and lazy loading

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development (optional)
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **React Query** - Server state management and caching
- **React Router 6** - Client-side routing
- **Lucide React** - Modern icon library
- **Axios** - HTTP client with interceptors

### Backend
- **PHP 8+** - Modern PHP with type declarations
- **MySQL 8** - Relational database
- **PDO** - Secure database abstraction
- **Session-based Auth** - Secure authentication system

### Development
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## 📋 Prerequisites

- **Node.js 18+** and npm/yarn
- **PHP 8.0+** with extensions: PDO, MySQL, JSON
- **MySQL 8.0+** or MariaDB 10.6+
- **Web server** (Apache/Nginx) with PHP support

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/reverseHaze/fivem_dashboard.git
cd fivem_dashboard
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Or using yarn
yarn install
```

### 3. Database Setup
1. Create a MySQL database named `webdev`
2. Import the SQL schema:
```bash
mysql -u root -p webdev < sql/fivem_dashboard.sql
```

### 4. Configuration
1. Update database credentials in `/api/index.php`:
```php
private function __construct() {
    $config = [
        'host' => 'localhost',
        'dbname' => 'webdev',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4'
    ];
    // ...
}
```

2. Configure your web server to serve the project directory

### 5. Development Server
```bash
# Start the React development server
npm start

# Or using yarn
yarn start
```

The app will be available at `http://localhost:3000`

### 6. Production Build
```bash
# Build for production
npm run build

# Or using yarn
yarn build
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
fivem_dashboard/
├── public/                 # Static assets
├── src/                   # React source code
│   ├── components/        # Reusable components
│   │   ├── ui/           # UI components (Button, Card, etc.)
│   │   ├── layout/       # Layout components
│   │   └── dashboard/    # Dashboard-specific components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API services and utilities
│   ├── utils/            # Helper functions
│   ├── App.js            # Main App component
│   └── index.js          # Entry point
├── api/                  # PHP backend API
│   ├── auth/             # Authentication endpoints
│   ├── todo/             # Todo API endpoints
│   ├── chat/             # Chat API endpoints
│   └── index.php         # API router
├── sql/                  # Database schema
└── legacy/               # Original PHP files (for reference)
```

## 🔒 Security Features

- **Input Validation**: All user inputs are validated and sanitized
- **SQL Injection Protection**: Prepared statements for all database queries
- **XSS Prevention**: Proper output encoding and CSP headers
- **CSRF Protection**: Token-based CSRF protection
- **Session Security**: Secure session configuration
- **Password Hashing**: bcrypt password hashing

## 🌟 New Features in 2.0

- **Component-based Architecture**: Modular React components
- **Real-time Data**: Live updates without page refresh
- **Modern State Management**: React Query for server state
- **Responsive Design**: Works on all device sizes
- **Improved Performance**: Code splitting and lazy loading
- **Better UX**: Smooth animations and loading states
- **Type Safety**: Optional TypeScript support
- **Modern Tooling**: Vite, ESLint, Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Thies Bergenthal (@reverseHaze)**
- GitHub: [@reverseHaze](https://github.com/reverseHaze)
- Project: [Projekt #1](https://roguev.de/) | [Projekt #2](https://trap-life.de/)

## 🙏 Acknowledgments

- FiveM community for inspiration
- React team for the amazing framework
- Tailwind CSS team for the utility-first approach
- Contributors and testers

---

Made with ❤️ by [push.42](https://github.com/reverseHaze)
3. Update the database connection inside the `.php` files with your specific server details and Trackyserver API key.
4. Host the files on your server, accessible through your domain or IP address.
5. You're all set! Visit the dashboard through your chosen access point.

## Contributing

This project is open source, and contributions are always welcomed! Whether it's bug reports, feature suggestions, or code improvements - all forms of contribution help.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

Please ensure your pull request adheres to the following guidelines:

- Write clear, meaningful commit messages.
- The pull request description should describe what your patch does.
- If your PR changes the UI, it should include "before" and "after" screenshots.

## Disclaimer

This project doesn't use or provide any sensitive data. Please make sure to change the Trackyserver API key and other personalizable settings to match your own before deploying this dashboard.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Thies Bergenthal - thiesmk2@gmail.com - Discord: push.42

Project Link: [https://github.com/reverseHaze/fivem_dashboard](https://github.com/reverseHaze/fivem_dashboard)

---

Crafted with ❤️ by a passionate FiveM server administrator. Happy gaming and server managing!

## Acknowledgements

- FiveM Community
- TrackyServer API
- All contributors who help to make this dashboard better!
