# SupplyLink

A modern React application connecting local shops with reliable vendors for streamlined procurement.

## 🚀 Features

- **Multi-role Authentication**: Support for both shops and vendors
- **Real-time Dashboard**: Live order tracking and analytics
- **Order Management**: Create, track, and manage orders
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Smooth loading experiences throughout the app

## 🛠️ Tech Stack

- **React 19.1.1** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Context API** - State management
- **Fetch API** - HTTP requests

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd supplylink
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)

   ```bash
   # Create a .env file in the root directory
   REACT_APP_API_URL=https://vend-sell.onrender.com
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
supplylink/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/        # Shared components (LoadingSpinner, ErrorBoundary)
│   │   ├── layout/        # Layout components (Header, Sidebar)
│   │   ├── shop/          # Shop-specific components
│   │   └── vendor/        # Vendor-specific components
│   ├── context/           # React Context providers
│   ├── pages/             # Page components
│   │   ├── dashboard/     # Dashboard pages
│   │   └── ...           # Other pages
│   ├── services/          # API services
│   └── ...               # Other source files
├── package.json
└── README.md
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🎯 Key Components

### Authentication

- **AuthContext**: Manages user authentication state
- **LoginPage**: User login interface
- **RegisterPage**: User registration interface

### Dashboard

- **ShopOverview**: Dashboard overview for shops
- **CreateOrder**: Order creation interface
- **ShopOrders**: Order history and tracking

### Layout

- **Header**: Top navigation with user profile
- **Sidebar**: Navigation sidebar with role-based menu
- **ErrorBoundary**: Catches and handles React errors

## 🔌 API Integration

The app integrates with a backend API for:

- User authentication and registration
- Dashboard data fetching
- Order management
- Product catalog

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://vend-sell.onrender.com
```

## 🎨 Styling

The app uses **Tailwind CSS** for styling with:

- Responsive design
- Dark/light theme support
- Custom animations
- Consistent spacing and typography

## 🚨 Error Handling

- **Error Boundaries**: Catch React component errors
- **API Error Handling**: Proper error messages for API failures
- **Network Error Handling**: Graceful handling of network issues
- **Loading States**: User feedback during async operations

## 📱 Responsive Design

The app is fully responsive with:

- Mobile-first approach
- Touch-friendly interfaces
- Adaptive layouts
- Optimized for various screen sizes

## 🔒 Security

- **Token-based Authentication**: JWT tokens for secure sessions
- **Session Storage**: Secure token storage
- **Input Validation**: Client-side form validation
- **Error Sanitization**: Safe error message display

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**Made with ❤️ for the local businesses of Dankuni, West Bengal.**
