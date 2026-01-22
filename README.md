# ManageMate

ManageMate is a comprehensive event and user management platform built with Laravel (PHP) for the backend and React (TypeScript) for the frontend. It provides robust features for managing users, organizations, events, and check-ins, with a modern web interface and secure authentication.

## Features

- User authentication and registration (Laravel Fortify)
- Organization and user management
- Event creation, registration, and check-in
- Admin and SuperAdmin roles with dedicated services and repositories
- Email notifications (event tickets, etc.)
- RESTful API endpoints
- Database migrations and seeders
- Modern React frontend (TypeScript, Vite, Inertia.js)
- Unit and feature testing (Pest, PHPUnit)

## Project Structure

```
app/                # Laravel application code (Controllers, Models, Services, etc.)
bootstrap/          # Laravel bootstrap files
config/             # Application configuration files
public/             # Publicly accessible files (index.php, assets)
resources/          # Frontend assets (React, CSS, views)
routes/             # Route definitions (web, console, settings)
database/           # Migrations, seeders, factories
storage/            # Application storage (logs, cache, etc.)
tests/              # Unit and feature tests
vendor/             # Composer dependencies
```

## Getting Started

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js & npm
- MySQL or compatible database

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/Zanti00/ManageMate.git
    cd ManageMate
    ```
2. **Install PHP dependencies:**
    ```sh
    composer install
    ```
3. **Install Node.js dependencies:**
    ```sh
    npm install
    ```
4. **Copy and configure environment files:**
    ```sh
    cp .env.example .env
    # Edit .env to set database and mail credentials
    ```
5. **Generate application key:**
    ```sh
    php artisan key:generate
    ```
6. **Run migrations and seeders:**
    ```sh
    php artisan migrate --seed
    ```
7. **Build frontend assets:**
    ```sh
    npm run build
    ```
8. **Start the development server:**
    ```sh
    php artisan serve
    # In another terminal
    npm run dev
    ```

## Testing

- **PHP tests:**
    ```sh
    ./vendor/bin/pest
    # or
    ./vendor/bin/phpunit
    ```
- **JS/TS tests:**
  (Add your preferred JS/TS test runner if applicable)

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Authors

- [Zanti00](https://github.com/Zanti00)

---

For more information, see the documentation in the `docs/` folder (if available) or open an issue on GitHub.
