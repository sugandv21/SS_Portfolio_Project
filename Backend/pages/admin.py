from django.contrib import admin
from django.utils.html import format_html
from .models import SiteSettings, Role, HomePage
from .models import AboutPage, Skill
from .models import ResumePage, Education, Experience
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "featured", "order", "created")
    list_editable = ("featured", "order")
    list_filter = ("category", "featured")
    search_fields = ("title", "description", "tools", "tags")
    ordering = ("-featured", "order", "-created")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("image_preview",)

    fieldsets = (
        (None, {"fields": ("title", "slug", "description",
                           "category", "tools", "tags", "image", 
                           "live_url", "github_url", 
                           "image_preview", "featured", "order")}),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:120px; border-radius:6px;" />', obj.image.url)
        return "(no image)"
    image_preview.short_description = "Preview"


class EducationInline(admin.TabularInline):
    model = ResumePage.education.through
    extra = 1
    verbose_name = "Education assignment"
    verbose_name_plural = "Education assignments"

class ExperienceInline(admin.TabularInline):
    model = ResumePage.experience.through
    extra = 1
    verbose_name = "Experience assignment"
    verbose_name_plural = "Experience assignments"

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("title", "date_range", "institution", "order")
    list_editable = ("order",)
    ordering = ("order",)
    search_fields = ("title", "institution")
    fields = ("title", "date_range", "institution", "description", "order")

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "date_range", "order")
    list_editable = ("order",)
    ordering = ("order",)
    search_fields = ("title", "company")
    fields = ("title", "company", "date_range", "bullets", "order")

@admin.register(ResumePage)
class ResumePageAdmin(admin.ModelAdmin):
    list_display = ("title", "created", "resume_file_preview")
    readonly_fields = ("resume_file_preview",)
    search_fields = ("title", "intro")
    inlines = [EducationInline, ExperienceInline]
    fieldsets = (
        (None, {"fields": ("title", "intro", "resume_file")}),
        ("Preview", {"fields": ("resume_file_preview",)}),
    )

    def resume_file_preview(self, obj):
        if obj.resume_file:
            return format_html(
                '<a href="{}" target="_blank" rel="noopener noreferrer">Download file</a>',
                obj.resume_file.url
            )
        return "(no file)"
    resume_file_preview.short_description = "Resume file"


class SkillInline(admin.TabularInline):
    model = AboutPage.skills.through  
    extra = 1
    verbose_name = "Skill assignment"
    verbose_name_plural = "Assigned skills"

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "percent", "order",)
    list_editable = ("percent", "order")
    ordering = ("order",)
    search_fields = ("name",)

@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    list_display = ("title", "created", "profile_image_preview")
    readonly_fields = ("profile_image_preview",)
    search_fields = ("title", "intro")
    inlines = [SkillInline]
    fieldsets = (
        (None, {"fields": ("title", "intro", "profile_image", "email", "location", "phone")}),
        ("Preview", {"fields": ("profile_image_preview",)}),
    )

    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" style="max-height:160px; border-radius:8px;" />', obj.profile_image.url)
        return "(no image)"
    profile_image_preview.short_description = "Profile image preview"


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("brand_name", "primary_color", "secondary_color", "logo_preview")
    readonly_fields = ("logo_preview",)

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="max-height:80px; border-radius:6px;" />', obj.logo.url)
        return "(no logo)"
    logo_preview.short_description = "Logo preview"


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("name", "order")
    ordering = ("order",)
    search_fields = ("name",)


@admin.register(HomePage)
class HomePageAdmin(admin.ModelAdmin):
    list_display = ("full_name", "created", "profile_image_preview")
    readonly_fields = ("profile_image_preview",)
    search_fields = ("full_name", "intro")
    ordering = ("-created",)

    fieldsets = (
        (None, {"fields": ("full_name", "intro", "roles", "profile_image")}),
        ("Preview", {"fields": ("profile_image_preview",)}),
    )

    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" style="max-height:160px; border-radius:8px;" />', obj.profile_image.url)
        return "(no image)"
    profile_image_preview.short_description = "Profile image preview"


