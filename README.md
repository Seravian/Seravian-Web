# Seravian – Web Application

[![Netlify Status](https://api.netlify.com/api/v1/badges/2eea896a-4152-4776-b44d-61866244adee/deploy-status)](https://app.netlify.com/projects/seravian/deploys)

This repository contains the **Angular web application** for **Seravian**, a mental health support platform developed as a **Graduation Project** by Computer Science students (2024–2025).

The web application provides a responsive and intuitive interface for users to access AI-powered mental health support, emotional analysis, and diagnostic tools. It communicates with the Seravian backend API to deliver seamless real-time chat experiences and comprehensive mental health assessments across all devices.

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Framework:** Angular 18
- **UI Framework:** Bootstrap + Native CSS
- **Build Tool:** Angular CLI
- **HTTP Client:** Angular HttpClient
- **Real-time Communication:** SignalR Client
- **State Management:** NgRx
- **Routing:** Angular Router
- **Authentication:** Angular AuthGuard
- **Package Manager:** npm
- **Backend Integration:** RESTful APIs + Real-time SignalR connections

---

## 🌐 Web Screenshots

### Core Features
| Feature | Description |
|:---:|:---:|
| *Screenshots will be added here* | Access help resources and mental support |
| *Screenshots will be added here* | Real-time messaging interface with AI assistant |
| *Screenshots will be added here* | Comprehensive psychological assessments and reports |

---

## 📋 App Features

- **🤖 AI-Powered Mental Health Support** - Advanced conversational AI for emotional support
- **💬 Real-time Chat** - Instant messaging with intelligent response suggestions
- **📊 Mental Health Diagnostics** - Comprehensive psychological assessments and reports
- **🔒 Secure Authentication** - JWT-based authentication with email OTP verification
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **🌙 Modern UI/UX** - Clean and intuitive interface with Bootstrap styling
- **⚡ Real-time Updates** - Live chat updates using SignalR connections
- **🔐 Route Protection** - Secure routing with Angular AuthGuard

---

## 💻 Prerequisites

To build and run this project, make sure to have the following dependencies:

- ✅ [Node.js](https://nodejs.org/) (Latest LTS version)
- ✅ [Angular CLI](https://angular.io/cli) (Version 18.0.0+)
- ✅ [TypeScript](https://www.typescriptlang.org/) (Latest version)
- ✅ npm (comes with Node.js)

## 🧪 Running Locally

1. **Clone the repo:**

   ```bash
   git clone https://github.com/seravian-org/Seravian-Web.git
   cd Seravian-Web
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure API Endpoints:**
   
   Update the environment files in `src/environments/` with your backend API configuration:

   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'your_development_api_url_here',
     signalRUrl: 'your_signalr_hub_url_here'
   };
   ```

   ```typescript
   // src/environments/environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: 'your_production_api_url_here',
     signalRUrl: 'your_production_signalr_hub_url_here'
   };
   ```

4. **Start the development server:**

   ```bash
   ng serve
   ```

   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

5. **Build for production:**

   ```bash
   ng build --configuration=production
   ```

---

## 🚀 Deployment

### Netlify Deployment

This project is automatically deployed to Netlify with continuous integration:

- **Live URL:** [https://seravian.netlify.app](https://seravian.netlify.app)
- **Auto-Deploy:** Pushes to the main branch automatically trigger new deployments
- **Build Command:** `ng build --configuration=production`
- **Publish Directory:** `dist/seravian`

### Manual Deployment

1. **Build the project:**

   ```bash
   ng build --configuration=production
   ```

2. **Deploy the `dist/` folder** to your preferred hosting service (Netlify, Vercel, Firebase Hosting, etc.)

---

## 🔧 Configuration

### 🌐 Environment Configuration

The application uses Angular's environment system for configuration:

| File | Description | Usage |
|------|-------------|--------|
| `environment.ts` | Development environment settings | Local development |
| `environment.prod.ts` | Production environment settings | Production builds |

### 🔐 Authentication Flow

- **JWT Token Management:** Automatic token refresh and storage
- **Route Guards:** Protected routes using Angular AuthGuard
- **Email OTP Verification:** Secure user authentication flow
- **Session Management:** Automatic logout on token expiration

### 📡 Real-time Features

- **SignalR Integration:** Real-time chat messaging
- **Live Updates:** Instant message delivery and status updates
- **Connection Management:** Automatic reconnection on network issues

---

## 🎨 UI/UX Features

- **Responsive Design:** Bootstrap-based responsive layout for all screen sizes
- **Modern Interface:** Clean and intuitive user experience
- **Accessibility:** WCAG compliant design with proper ARIA labels
- **Cross-browser Compatibility:** Supports all modern browsers
- **Progressive Web App:** PWA capabilities for enhanced mobile experience

---

## 👥 Authors & Ownership

This web application is part of the **Seravian** GitHub organization, which includes:

- [`Seravian-Web`](https://github.com/Seravian/Seravian-Web) (Angular)
- [`Seravian-Backend`](https://github.com/Seravian/Seravian-Backend) (ASP.NET Core)
- [`Seravian-App`](https://github.com/Seravian/Seravian-App) (Kotlin – Android)
- [`Seravian-AI`](https://github.com/Seravian/Seravian-AI) (FastAPI + Python)

> 📌 **Note:** While the platform is a team project,  
> 🌐 **this web application was collaboratively developed by:**
> - 🧑‍💻 **[Abdalrhman Alhrery](https://github.com/alhrery2003)**
> - 🧑‍💻 **[Khalid Mohamed](https://github.com/Khalidsaied)**

---

## 📄 License

Elastic License v2.0 – see [`LICENSE`](./LICENSE)

---
