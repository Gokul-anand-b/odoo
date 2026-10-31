"""
Django settings for WedPilot AI backend.

This is the general configuration for the Django REST Framework foundation.
Database credentials, authentication, and feature-specific settings
will be configured by the development team.
"""

from pathlib import Path
from decouple import AutoConfig

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

config = AutoConfig(search_path=BASE_DIR)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config(
    'DJANGO_SECRET_KEY',
    'django-insecure-wedpilot-dev-key-change-in-production'
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DJANGO_DEBUG', default='True').lower() == 'true'

ALLOWED_HOSTS = config(
    'DJANGO_ALLOWED_HOSTS',
    default='localhost,127.0.0.1,testserver,*',
).split(',')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'corsheaders',
    'django_filters',
    'drf_spectacular',

    # Project apps
    'api',
    'common',
    'vendor_intelligence',
    'wedding_blueprint',
    'disruption_engine',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database — Supabase PostgreSQL (pooler) default across all team machines
_db_engine = config('DB_ENGINE', default='django.db.backends.postgresql')
_is_postgres = 'postgresql' in _db_engine

DATABASES = {
    'default': {
        'ENGINE': _db_engine,
        'NAME': config('DB_NAME', default='postgres'),
        'USER': config('DB_USER', default='postgres.ccjaplmejbjhlgdxwvss'),
        'PASSWORD': config('DB_PASSWORD', default='Gokul@14102005'),
        'HOST': config('DB_HOST', default='aws-1-eu-west-3.pooler.supabase.com'),
        'PORT': config('DB_PORT', default='6543'),
        **({'OPTIONS': {'sslmode': 'require'}} if _is_postgres else {}),
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True


# Static files
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'


# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Django REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
    },
}


# DRF Spectacular (OpenAPI documentation)
SPECTACULAR_SETTINGS = {
    'TITLE': 'WedPilot AI API',
    'DESCRIPTION': 'API for WedPilot AI — Intelligent Wedding Planning & Operations Management Platform',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}


# CORS configuration
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000',
).split(',')

CORS_ALLOW_CREDENTIALS = True
