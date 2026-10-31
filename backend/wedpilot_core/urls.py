from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('api.urls')),
    path('api/vendor-intelligence/', include('vendor_intelligence.urls')),
    path('api/wedding-blueprint/', include('wedding_blueprint.urls')),
    path('api/command-centre/', include('command_centre.urls')),
    path('api/', include('vendor_intelligence.urls')), # direct alias
    path('api/', include('wedding_blueprint.urls')),
]
