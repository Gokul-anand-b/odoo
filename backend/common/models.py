"""
Base model mixins for WedPilot AI.

Provides common fields (timestamps, soft delete) that all
feature-specific models should inherit from.
"""

from django.db import models


class TimeStampedModel(models.Model):
    """
    Abstract base model that provides self-updating
    created_at and updated_at fields.
    
    Usage:
        class Wedding(TimeStampedModel):
            name = models.CharField(max_length=255)
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']


class SoftDeleteModel(TimeStampedModel):
    """
    Abstract model that supports soft deletion.
    Records are marked as deleted instead of being removed from the database.
    
    Usage:
        class Vendor(SoftDeleteModel):
            name = models.CharField(max_length=255)
    """
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

    def soft_delete(self):
        from django.utils import timezone
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_at', 'updated_at'])

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_deleted', 'deleted_at', 'updated_at'])
