from rest_framework import viewsets, status
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives
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
        owner_message = f"Name: {instance.name}\nEmail: {instance.email}\nSubject: {instance.subject}\n\nMessage:\n{instance.message}"
        send_mail(
            owner_subject,
            owner_message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.OWNER_EMAIL],
            fail_silently=False,
        )

        # Thank-you email to sender
        thanks_subject = "Thanks for reaching out!"
        thanks_body = f"Hi {instance.name},\n\nThank you for reaching me. I have received your message and will respond soon.\n\nRegards,\n{settings.DEFAULT_FROM_EMAIL}"
        send_mail(
            thanks_subject,
            thanks_body,
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
            fail_silently=False,
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
