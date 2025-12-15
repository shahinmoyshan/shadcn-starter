# Php + React + Shadcn Starter

A modern full-stack starter template combining TinyMVC PHP framework with React and Shadcn UI components.

## Features

- **TinyMVC Framework** - Lightweight MVC PHP framework
- **React 18** - Modern React with hooks
- **Shadcn UI** - Beautiful and accessible components
- **Vite** - Lightning-fast build tool
- **Authentication** - Built-in auth system with middleware
- **API Ready** - RESTful API routes
- **Database Migrations** - Version control for your database

## Getting Started

### Installation

```bash
# Install PHP dependencies
composer install

# Generate application key
php spark key:generate

# Run migrations and seed database
php spark migrate --seed
```

### Development

```bash
# Start PHP development server
php spark serve

# In another terminal, start Vite dev server
npm run dev
```

Visit `http://localhost:8000` to see your application.

### Production

```bash
# Build frontend assets
npm run build
```

Configure your web server to point to the `public` directory.

## Project Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Application controllers
│   │   └── Middlewares/     # Auth, CORS, CSRF middlewares
│   ├── Models/              # Database models
│   └── Providers/           # Service providers
├── bootstrap/               # Application bootstrap files
├── database/
│   └── migrations/          # Database migrations
├── public/                  # Web server document root
│   └── build/              # Compiled frontend assets
├── resources/
│   └── app/                # React application
│       ├── components/     # React components & Shadcn UI
│       ├── contexts/       # React contexts (App, Auth)
│       ├── guards/         # Route guards
│       ├── layouts/        # Page layouts
│       ├── pages/          # Application pages
│       └── lib/            # Utilities and API client
├── routes/
│   ├── api.php            # API routes
│   ├── web.php            # Web routes
│   └── commands.php       # CLI commands
└── storage/               # Logs, cache, uploads
```

## Available Commands

```bash
# Generate application key
php spark key:generate

# Run migrations
php spark migrate

# Run migrations with seed data
php spark migrate --seed

# Start development server
php spark serve

# Build frontend for production
npm run build

# Start Vite dev server
npm run dev
```

## License

MIT License
