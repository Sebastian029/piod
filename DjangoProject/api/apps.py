import os
import sys

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        if os.environ.get('RUN_MAIN') and 'runserver' in sys.argv:
            host = '127.0.0.1'
            port = '8000'
            swagger_url = f"http://{host}:{port}/api/docs"
            print(f'Swagger UI available at: {swagger_url}')
