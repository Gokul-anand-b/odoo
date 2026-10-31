from django.contrib import admin

from .models import Agreement, Document, Guest, Notification, Payment, RSVP, VendorAssignment, VendorInvoice

admin.site.register((Agreement, Payment, VendorInvoice, Guest, RSVP, VendorAssignment, Document, Notification))
