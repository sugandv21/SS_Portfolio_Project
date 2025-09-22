# contact/admin.py
from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created", "preview_message")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("created",)
    list_filter = ("created",)
    ordering = ("-created",)
    date_hierarchy = "created"

    def preview_message(self, obj):
        return (obj.message[:80] + "...") if obj.message and len(obj.message) > 80 else (obj.message or "")
    preview_message.short_description = "Message preview"
