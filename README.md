# FiveM Dashboard 2.0

A completely modernized FiveM server administration dashboard built with **React 19.1**, modern PHP backend, and Tailwind CSS.

## 🚀 Production Ready!

**Want to deploy this dashboard?** It's production-ready with mockup data included!

📖 **[Complete Deployment Guide →](PRODUCTION_DEPLOYMENT.md)**

- ✅ **React 19.1** - Latest React with best performance
- ✅ **Zero vulnerabilities** - All security issues fixed
- ✅ **Mockup data included** - Works without FiveM server
- ✅ **15-minute deployment** - Simple upload process
- ✅ **Mobile responsive** - Works on all devices

## 🚀 Features

### Core Dashboard Features

- **🎮 Real-time FiveM Server Integration** - Live data from your FiveM server database
- **📊 Advanced Analytics** - Player statistics, server metrics, and performance monitoring
- **👥 Player Management** - Comprehensive player profiles with jobs, money, and activity tracking
- **🚗 Vehicle Management** - Complete vehicle ownership and storage tracking
- **🏆 Hall of Fame** - Leaderboards for richest players, most vehicles, top companies/gangs
- **💬 Real-time Chat** - Live chat system with statistics and user management
- **📝 Task Management** - Todo system for server administration
- **⚙️ Server Monitoring** - Live server status with TrackyServer API integration

### Technical Features

- **React 18** with modern hooks and concurrent features
- **React Query** for efficient server state management
- **React Router 6** for client-side routing
- **Tailwind CSS 3.4+** for modern, responsive design
- **Modern PHP 8+ API** with PDO and prepared statements
- **Real-time updates** with automatic data refreshing
- **Responsive design** - works on desktop, tablet, and mobile
- **Authentication system** with session management
- **Error handling** and loading states throughout

## � Project Structure

```
fivem_dashboard/
├── src/                          # React application source
│   ├── components/
│   │   ├── dashboard/           # Dashboard-specific components
│   │   │   ├── FivemOverview.js      # Main dashboard with FiveM stats
│   │   │   ├── PlayersManagement.js  # Player management interface
│   │   │   ├── VehicleManagement.js  # Vehicle tracking
│   │   │   ├── HallOfFame.js         # Leaderboards
│   │   │   ├── Chat.js               # Real-time chat
│   │   │   ├── TodoList.js           # Task management
│   │   │   ├── ServerStatus.js       # Server monitoring
│   │   │   └── Settings.js           # User settings
│   │   ├── layout/              # Layout components
│   │   └── ui/                  # Reusable UI components
│   ├── pages/                   # Page components
│   ├── services/                # API services
│   ├── hooks/                   # Custom React hooks
│   └── utils/                   # Utility functions
├── api/                         # PHP Backend API
│   ├── auth/                    # Authentication endpoints
│   ├── fivem/                   # FiveM-specific endpoints
│   │   ├── get_players.php      # Player data from users table
│   │   ├── get_vehicles.php     # Vehicle data from owned_vehicles
│   │   ├── get_hall_of_fame.php # Leaderboard calculations
│   │   └── get_server_status.php # Server status with TrackyServer
│   ├── chat/                    # Chat system endpoints
│   ├── todo/                    # Task management endpoints
│   └── config/                  # Database configuration
├── public/                      # Static assets
└── build/                       # Production build output
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- PHP 8+ with PDO MySQL extension
- MySQL/MariaDB database
- Web server (Apache/Nginx)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd fivem_dashboard
npm install
```

### 2. Database Configuration

Edit `api/config/database.php` with your database credentials:

```php
// Main dashboard database
define('DB_HOST', 'localhost');
define('DB_NAME', 'webdev');
define('DB_USER', 'root');
define('DB_PASS', '');

// FiveM server database
define('FIVEM_DB_HOST', 'localhost');
define('FIVEM_DB_NAME', 'your_fivem_database');
define('FIVEM_DB_USER', 'root');
define('FIVEM_DB_PASS', '');

// TrackyServer API (optional)
define('TRACKY_SERVER_KEY', 'your_api_key');
define('TRACKY_SERVER_ID', 'your_server_id');
```

### 3. Import Database Schema

Import the SQL file to create required tables:

```bash
mysql -u root -p webdev < sql/fivem_dashboard.sql
```

### 4. Build for Production

```bash
npm run build
```

### 5. Deploy

Copy the `build/` folder contents to your web server document root, ensuring the `api/` folder is also accessible.

## 🎯 FiveM Integration

### Required Database Tables

The dashboard expects these tables in your FiveM database:

- **`users`** - Player accounts with identifiers, names, jobs, money
- **`owned_vehicles`** - Vehicle ownership data
- **`company_money`** - Company/business finances (optional)
- **`gang_money`** - Gang finances (optional)

### Supported Frameworks

- **ESX** - Full compatibility with ESX player and vehicle systems
- **QBCore** - Compatible with QBCore database structure
- **Custom** - Easily adaptable to custom database schemas

## 🎨 Dashboard Sections

### 1. Overview Dashboard

- Real-time player count and server status
- Key performance metrics and statistics
- Quick access to critical information
- Hall of Fame preview

### 2. Players Management

- Complete player database with search and filtering
- Player profiles showing jobs, ranks, and finances
- Money tracking (cash, bank, black money)
- Last seen and activity monitoring

### 3. Vehicle Management

- All registered vehicles with ownership details
- Storage status (garage/out on map)
- Search by model, plate, or owner
- Vehicle statistics and analytics

### 4. Hall of Fame

- **Richest Players** - Top players by total money
- **Most Vehicles** - Players with most owned vehicles
- **Most Active** - Recently active players
- **Organizations** - Top companies and gangs by wealth

### 5. Live Chat

- Real-time messaging system
- User presence indicators
- Chat statistics and moderation tools
- Message history and search

### 6. Server Monitoring

- Live server status via TrackyServer API
- Player count and connection monitoring
- Server performance metrics
- Uptime and version tracking

## � Security Features

- **Session-based authentication** with secure session handling
- **SQL injection protection** via PDO prepared statements
- **XSS protection** with proper input sanitization
- **CSRF protection** with token validation
- **Rate limiting** on API endpoints
- **Secure password hashing** with PHP's password_hash()

## 🚀 Performance Optimizations

- **React Query caching** for efficient data fetching
- **Optimized re-renders** with React.memo and useMemo
- **Code splitting** for faster initial load times
- **Image optimization** and lazy loading
- **Minified production builds**
- **Database query optimization** with indexed lookups

## 🎨 Customization

### Styling

The dashboard uses Tailwind CSS for easy customization:

- Edit `tailwind.config.js` for theme customization
- Modify color schemes in component files
- Responsive breakpoints easily adjustable

### Adding New Features

1. Create new API endpoints in `api/` folder
2. Add corresponding service functions in `src/services/`
3. Create React components in `src/components/dashboard/`
4. Update navigation in `DashboardLayout.js`

## 📱 Mobile Support

Fully responsive design with:

- Mobile-optimized navigation
- Touch-friendly interfaces
- Adaptive layouts for all screen sizes
- Progressive Web App capabilities

## 🔄 Version History

### Version 2.0.0 (Current)

- Complete rewrite with React 18
- Modern PHP 8+ backend
- Enhanced FiveM integration
- Real-time features
- Mobile-responsive design
- Comprehensive player/vehicle management
- Hall of Fame system

### Version 1.0.0 (Legacy)

- Original PHP-based dashboard
- Basic FiveM integration
- jQuery-based frontend
- Limited mobile support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ for the FiveM community**
