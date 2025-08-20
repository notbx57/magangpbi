<img width="403" height="515" alt="image" src="https://github.com/user-attachments/assets/75199c37-bf1b-46c3-9225-3221d594e805" />

**MAJOR REWRITE : POWERGYM** 💪

Changelogs :
- Ditulis dari awal karena menggunakan React (Inertia)
- Responsive by Default
- Security, Middleware menggunakan Laravel Auth (atau lebih dikenal laravel breeze)
- CRUD Multirole Member, Staff, Admin
- Payment gateway masih simple

<img width="409" height="833" alt="image" src="https://github.com/user-attachments/assets/25f1f39a-894b-4723-98fe-db8ecca6d944" />


Instruksi :
1. clone github
2. composer i
3. npm i
4. php artisan key:generate
5. php artisan migrate:fresh
6. php artisan db:seed
7. npm run build (untuk gzip)
8. npm run dev (untuk menjalankan react)
9. php artisan serve

Teknologi :

Framework : Laravel 12
Frontend: React (Inertia)
Backend: PHP 8.4
Database: MYSQL
Auth, Middleware : Laravel Auth (Breeze)
