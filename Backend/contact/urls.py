from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import ContactMessageViewSet

router = DefaultRouter()
router.register("messages", ContactMessageViewSet, basename="contact-messages")

urlpatterns = [path("", include(router.urls))]
