# Cloud File Storage API

### Настройки приложения
Основные настройки приложения находятся в файле config.ini

Секция для настройки подключения к базе данных
### [database]
- NAME=NAMEDATABASE
- USER=USERNAME
- PASSWORD=PASSWORD
- HOST=HOSTNAME
- PORT=5432

Настройка пути для сохранения файлов
### [path]
- save_url = upload

Django REST Framework приложение для облачного хранения файлов с системой аутентификации и авторизации.

## Основные возможности
## Backend

### Аутентификация и пользователи
- Кастомная модель пользователя `CustomUser` с дополнительным полем `login`
- Регистрация пользователей с валидацией данных
- Token-based аутентификация
- Удаление пользователей (только для администраторов)

### Управление файлами
- Загрузка файлов с автоматическим определением размера и имени
- Скачивание файлов с обновлением даты последнего скачивания
- Публичные URL для доступа к файлам
- Комментарии к файлам
- Фильтрация файлов по владельцу (для администраторов)

### Система прав доступа
- `IsOwnerOrAdmin` - доступ только владельцу или администратору
- `IsAdmin` - доступ только администраторам
- Защита от удаления собственного аккаунта администратором

### Логирование
- Middleware для логирования всех HTTP запросов
- Запись времени выполнения запросов
- Логирование исключений и ошибок
- Детальная информация о заголовках и параметрах

## Модели данных

### CustomUser
- Наследуется от `AbstractUser`
- Дополнительное поле `login` (уникальное)

### File
- `name` - имя файла
- `size` - размер файла
- `date_uploaded` - дата загрузки
- `date_downloaded` - дата последнего скачивания
- `pub_url` - публичный URL
- `file` - файловое поле
- `comment` - комментарий
- `owner` - владелец файла (ForeignKey на CustomUser)

## API Endpoints

### Файлы
- `GET/POST /files/` - список файлов и загрузка нового
- `GET/PUT/PATCH/DELETE /files/{id}/` - работа с конкретным файлом
- `GET /files/{id}/download/` - скачивание файла
- `GET /files/filter/{owner}/` - фильтрация по владельцу (admin only)

### Пользователи
- `POST /auth/users/` - регистрация пользователя
- `DELETE /auth/users/{id}/` - удаление пользователя (admin only)

## Настройки

### Требования
- Django 5.2.7+
- Django REST Framework
- Djoser для аутентификации
- django-cors-headers для CORS

### Конфигурация
- База данных: PostgreSQL
- Медиафайлы: `/media/`
- CORS
- Аутентификация: Token, Session, Basic

# Frontend

React приложение для управления облачным файловым хранилищем с интерфейсом администратора и пользователя.

Приложение полностью синхронизировано с Django REST API бэкенда:
Использует те же модели данных
Соответствует системе прав доступа
Обрабатывает все возможные HTTP статусы
Предоставляет понятные сообщения об ошибках

## Технологии

- **React** - фреймворк для построения пользовательского интерфейса
- **React Router** - маршрутизация между страницами
- **Redux Toolkit** - управление состоянием приложения
- **Axios** - HTTP клиент для взаимодействия с API
- **CSS Modules** - стилизация компонентов

## Структура проекта

### Основные страницы
- `Login.jsx` - страница входа в систему
- `SignIn.jsx` - страница регистрации
- `Main.jsx` - главная страница пользователя
- `Staff.jsx` - панель администратора

## Система аутентификации

### Защита маршрутов
- Автоматическая проверка аутентификации при загрузке маршрутов
- Редирект неаутентифицированных пользователей на страницу входа
- Редирект аутентифицированных пользователей от гостевых страниц

### Механизм аутентификации
- Token-based аутентификация
- Автоматическое добавление токена в заголовки запросов
- Хранение токена в localStorage

## Управление состоянием (Redux)

## Функциональность

### Для всех пользователей
- **Регистрация** - создание нового аккаунта
- **Вход в систему** - аутентификация пользователя
- **Выход из системы** - завершение сессии

### Для обычных пользователей
- Просмотр списка своих файлов
- Загрузка новых файлов
- Скачивание файлов
- Управление файлами (переименование, удаление)

### Для администраторов
- Просмотр списка всех пользователей
- Просмотр файлов любого пользователя
- Удаление пользователей (кроме собственного аккаунта)
- Статистика по файлам (количество, общий размер)


# Установка и настройка 
## Backend
### Создание виртуального окружения
python -m venv venv
source venv/bin/activate

### Установка зависимостей
pip install -r requarements.txt

### Настройка Gunicorn (Создание systemd службы)
Создайте файл `/etc/systemd/system/cloud_storage.service` со следующим содержанием:

```ini
[Unit]
Description=Cloud Storage Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/your/project
ExecStart=/path/to/venv/bin/gunicorn --workers 3 --bind unix:/path/to/your/project/cloud_storage.sock backend.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

Обновите конфигурацию и запустите службу

```shell
sudo systemctl daemon-reload
sudo systemctl start cloud_storage
sudo systemctl enable cloud_storage
```

```shell
sudo apt update
sudo apt install nginx
```

# Конфигурация сайта
## конфигурационный файл 
`/etc/nginx/sites-available/cloud_storage`
```
upstream cloud_storage_app {
    server unix:/path/to/your/project/cloud_storage.sock fail_timeout=0;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Статические файлы Django
    location /static/ {
        alias /var/www/cloud_storage/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /var/www/cloud_storage/media/;
        expires 1y;
        add_header Cache-Control "public";
        client_max_body_size 100M;
    }

    # API routes
    location /api/ {
        proxy_pass http://cloud_storage_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # React фронтенд
    location / {
        root /var/www/cloud_storage/frontend/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```
## Опубликовываем сайт
```shell
sudo ln -s /etc/nginx/sites-available/cloud_storage /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```


# База данных
## Создание базы данных
```shell
sudo -u postgres psql
CREATE DATABASE "NAME DATABASE";
CREATE USER cloud_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE cloud_storage TO cloud_user;
```