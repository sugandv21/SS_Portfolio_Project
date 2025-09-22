from rest_framework import serializers
from .models import SiteSettings, HomePage, Role
from .models import Skill, AboutPage
from rest_framework import serializers
from .models import ResumePage, Education, Experience
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "description", "category",
            "tools", "tags", "image",
            "live_url", "github_url",
            "featured", "order", "created"
        ]

    def get_image(self, obj):
        req = self.context.get("request")
        if obj.image:
            return req.build_absolute_uri(obj.image.url) if req else obj.image.url
        return None



def _abs_url(file_field, request):
    if not file_field:
        return None
    if request:
        return request.build_absolute_uri(file_field.url)
    return getattr(file_field, "url", None)

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ["id", "title", "date_range", "institution", "description", "order"]

class ExperienceSerializer(serializers.ModelSerializer):
    bullets = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = ["id", "title", "company", "date_range", "bullets", "order"]

    def get_bullets(self, obj):
        # Convert newline-separated text into a list of bullet strings
        text = obj.bullets or ""
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return lines

class ResumePageSerializer(serializers.ModelSerializer):
    education = EducationSerializer(many=True)
    experience = ExperienceSerializer(many=True)
    resume_file = serializers.SerializerMethodField()

    class Meta:
        model = ResumePage
        fields = ["id", "title", "intro", "education", "experience", "resume_file", "created"]

    def get_resume_file(self, obj):
        req = self.context.get("request")
        return _abs_url(obj.resume_file, req)


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "percent", "order"]

def _absolute_url(field_file, request):
    if not field_file:
        return None
    if request:
        return request.build_absolute_uri(field_file.url)
    return getattr(field_file, "url", None)

class AboutPageSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    skills = SkillSerializer(many=True)

    class Meta:
        model = AboutPage
        fields = ["id", "title", "intro", "profile_image", "email", "location", "phone", "skills", "created"]

    def get_profile_image(self, obj):
        req = self.context.get("request")
        return _absolute_url(obj.profile_image, req)


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "name", "order"]

class SiteSettingsSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    class Meta:
        model = SiteSettings
        fields = ["brand_name", "logo", "primary_color", "secondary_color"]

    def get_logo(self, obj):
        req = self.context.get("request")
        return req.build_absolute_uri(obj.logo.url) if obj.logo and req else (obj.logo.url if obj.logo else None)

class HomePageSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    roles = RoleSerializer(many=True)
    class Meta:
        model = HomePage
        fields = ["id", "full_name", "intro", "profile_image", "roles"]

    def get_profile_image(self, obj):
        req = self.context.get("request")
        return req.build_absolute_uri(obj.profile_image.url) if obj.profile_image and req else (obj.profile_image.url if obj.profile_image else None)


