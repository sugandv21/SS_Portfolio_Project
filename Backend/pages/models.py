from django.db import models
class Project(models.Model):
    CATEGORY_CHOICES = [
        ("ecommerce", "E-Commerce"),
        ("education", "Education"),
        ("healthcare", "Healthcare"),
        ("productivity", "Productivity Tools"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default="other"
    )
    tools = models.CharField(max_length=255, blank=True)
    tags = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    live_url = models.URLField("Deployment Link", blank=True, null=True)
    github_url = models.URLField("GitHub Link", blank=True, null=True)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-featured", "order", "-created"]

    def __str__(self):
        return self.title



class Education(models.Model):
    title = models.CharField(max_length=255)            # e.g. "M.E. in Computer Science and Engineering"
    date_range = models.CharField(max_length=80, blank=True)  # e.g. "2014 - 2016"
    institution = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Education"
        verbose_name_plural = "Educations"

    def __str__(self):
        return self.title


class Experience(models.Model):
    title = models.CharField(max_length=255)            # e.g. "Python Full Stack Developer Trainee"
    date_range = models.CharField(max_length=80, blank=True)
    company = models.CharField(max_length=255, blank=True)
    bullets = models.TextField(
        blank=True,
        help_text="Use newline-separated bullets. They will be rendered as list items."
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Experience"
        verbose_name_plural = "Experiences"

    def __str__(self):
        return f"{self.title} — {self.company}"


class ResumePage(models.Model):
    title = models.CharField(max_length=200, default="My Resume")
    intro = models.TextField(blank=True, help_text="Short intro shown above resume sections.")
    education = models.ManyToManyField(Education, blank=True, related_name="resume_pages")
    experience = models.ManyToManyField(Experience, blank=True, related_name="resume_pages")
    resume_file = models.FileField(upload_to="resumes/", blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Resume Page"
        verbose_name_plural = "Resume Pages"

    def __str__(self):
        return "Resume Page"

class Skill(models.Model):
    name = models.CharField(max_length=100)
    percent = models.PositiveSmallIntegerField(default=50)  # 0-100
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Skill"
        verbose_name_plural = "Skills"

    def __str__(self):
        return f"{self.name} ({self.percent}%)"


class AboutPage(models.Model):
    title = models.CharField(max_length=200, default="About Me")
    intro = models.TextField(blank=True, help_text="Intro paragraph (markdown/plain text)")
    profile_image = models.ImageField(upload_to="about/profile/", blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    skills = models.ManyToManyField(Skill, blank=True, related_name="about_pages")

    def __str__(self):
        return "About Page"


class SiteSettings(models.Model):
    brand_name = models.CharField(max_length=100, default="My portfolio")
    logo = models.ImageField(upload_to="site/", blank=True, null=True)
    primary_color = models.CharField(max_length=20, default="#00FFFF")   # cyan
    secondary_color = models.CharField(max_length=20, default="#8A2BE2") # purple

    def __str__(self):
        return "Site Settings"

class Role(models.Model):
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class HomePage(models.Model):
    full_name = models.CharField(max_length=200)
    intro = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to="profiles/")
    roles = models.ManyToManyField(Role, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Home: {self.full_name}"

