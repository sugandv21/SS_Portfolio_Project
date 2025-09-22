from rest_framework import viewsets, status
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by("-created")
    serializer_class = ContactMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        # Prepare email to OWNER
        owner_subject = f"New contact from {instance.name}"
        owner_message = (
            f"Name: {instance.name}\n"
            f"Email: {instance.email}\n"
            f"Subject: {instance.subject}\n\n"
            f"Message:\n{instance.message}"
        )
        send_mail(
            owner_subject,
            owner_message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.OWNER_EMAIL],
            fail_silently=False,
        )

        # Thank-you email to sender
        thanks_subject = "Acknowledgment of Your Message"
        thanks_body = f"""Dear {instance.name},

Thank you for contacting me. I have received your message and will respond at the earliest opportunity.

Kind regards,
{settings.DEFAULT_FROM_EMAIL}
Python Full Stack Developer, Madurai
"""
        send_mail(
            thanks_subject,
            thanks_body,
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
            fail_silently=False,
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
