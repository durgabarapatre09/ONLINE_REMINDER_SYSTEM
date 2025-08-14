# Online Reminder System

A modern, full-featured web application for managing personal reminders and tasks. Built with React, Redux Toolkit, and Material-UI, this application provides a seamless user experience for creating, managing, and organizing reminders.

## 🚀 Features

### Authentication & User Management
- **User Registration & Login**: Secure authentication system with JWT tokens
- **Profile Management**: Update user profile information
- **Protected Routes**: Secure access to authenticated features

### Reminder Management
- **Create Reminders**: Add new reminders with title, description, and due date
- **Delete Reminders**: Remove reminders with confirmation


## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.1
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Form Handling**: Formik with Yup validation
- **Date Management**: Day.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Emotion
- **Linting**: ESLint

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd online_reminder_system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🌐 API Configuration

The application is configured to connect to the backend API at `https://drkorean.in`. The API endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/signup`, `/api/auth/profile`
- **Reminders**: `/api/reminder` (CRUD operations)

## 🔐 Environment Variables

Currently, the application uses a hardcoded API base URL. For production deployment, consider using environment variables:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```


### Styling

The project uses a combination of:
- **Material-UI** for component styling
- **Tailwind CSS** for utility classes

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Netlify Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Happy Reminding!** 🎯
