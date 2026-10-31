from config.settings import *


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

if 'command_centre' not in INSTALLED_APPS:
    INSTALLED_APPS = [*INSTALLED_APPS, 'command_centre']
ROOT_URLCONF = 'demo_config.urls'
WSGI_APPLICATION = 'demo_config.wsgi.application'
