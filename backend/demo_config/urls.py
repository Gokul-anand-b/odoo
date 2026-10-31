from django.urls import path, include
from config.urls import urlpatterns as base_urlpatterns

urlpatterns = [
    *base_urlpatterns,
    path('api/command-centre/', include('command_centre.urls')),
]
