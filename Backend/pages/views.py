from rest_framework import viewsets
from .models import HomePage, SiteSettings
from .serializers import HomePageSerializer, SiteSettingsSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AboutPage, Skill
from .serializers import AboutPageSerializer, SkillSerializer
from .models import ResumePage, Education, Experience
from .serializers import ResumePageSerializer, EducationSerializer, ExperienceSerializer
from rest_framework import viewsets, filters
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all().order_by("-created")
    serializer_class = ProjectSerializer
    lookup_field = "slug"
    search_fields = ["title", "description", "tools", "tags"]
    ordering_fields = ["created", "order", "featured"]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs


class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Education.objects.all().order_by("order")
    serializer_class = EducationSerializer

class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experience.objects.all().order_by("order")
    serializer_class = ExperienceSerializer

class ResumePageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResumePage.objects.all().prefetch_related("education", "experience").order_by("-created")
    serializer_class = ResumePageSerializer

    # return single object for list route (frontend convenience)
    def list(self, request, *args, **kwargs):
        instance = self.get_queryset().first()
        if not instance:
            return Response(None)
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all().order_by("order")
    serializer_class = SkillSerializer

class AboutPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AboutPage.objects.all().prefetch_related("skills").order_by("-created")
    serializer_class = AboutPageSerializer

    # override list() so frontend can fetch single object from the same endpoint
    def list(self, request, *args, **kwargs):
        instance = self.get_queryset().first()
        if not instance:
            return Response(None)
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    # optional: endpoint to fetch latest explicitly
    @action(detail=False, methods=["get"])
    def latest(self, request):
        instance = self.get_queryset().first()
        if not instance:
            return Response(None)
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)


class SiteSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer

class HomePageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HomePage.objects.all().order_by("-created")
    serializer_class = HomePageSerializer

