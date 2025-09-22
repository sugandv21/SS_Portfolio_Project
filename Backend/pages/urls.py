# pages/urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"site-settings", views.SiteSettingsViewSet, basename="site-settings")
router.register(r"home", views.HomePageViewSet, basename="home")
router.register(r"about", views.AboutPageViewSet, basename="about")
router.register(r"skills", views.SkillViewSet, basename="skills")
router.register(r"education", views.EducationViewSet, basename="education")
router.register(r"experience", views.ExperienceViewSet, basename="experience")
router.register(r"resume", views.ResumePageViewSet, basename="resume")
router.register(r"projects", views.ProjectViewSet, basename="projects")

urlpatterns = [
    path("", include(router.urls)),
]
