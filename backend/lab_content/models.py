from django.db import models
from django.utils.text import slugify

class MediaMixin(models.Model):
    """Mixin for adding optional media fields to models."""
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    video = models.FileField(upload_to='videos/', blank=True, null=True)
    audio = models.FileField(upload_to='audios/', blank=True, null=True)
    document = models.FileField(upload_to='documents/', blank=True, null=True)

    class Meta:
        abstract = True

class LabMember(MediaMixin):
    """Model for lab members: professor, RAs, students, etc."""
    MEMBER_TYPES = [
        ('PROF', 'Professor'),
        ('RA', 'Research Assistant'),
        ('ASSOC', 'Research Associate'),
        ('MASTERS', 'Masters Student'),
        ('PHD', 'PhD Researcher'),
        ('POSTDOC', 'Postdoctoral Fellow'),
        ('STAFF', 'Staff'),
        ('OTHER', 'Other'),
    ]
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    member_type = models.CharField(max_length=20, choices=MEMBER_TYPES)
    position = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    joined_date = models.DateField()
    left_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="For sorting members")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.get_member_type_display()})"

    class Meta:
        ordering = ['order', 'name']

class Project(MediaMixin):
    """Model for research projects."""
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    members = models.ManyToManyField(LabMember, related_name='projects', blank=True)
    website = models.URLField(blank=True)
    github_repo = models.URLField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-start_date']

class Collaboration(MediaMixin):
    """Model for collaborations with other labs/institutions."""
    COLLABORATION_TYPES = [
        ('LAB', 'Other Lab'),
        ('PROV', 'Provincial'),
        ('NAT', 'National'),
        ('INT', 'International'),
    ]
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    collaboration_type = models.CharField(max_length=10, choices=COLLABORATION_TYPES)
    institution = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    website = models.URLField(blank=True)
    projects = models.ManyToManyField(Project, related_name='collaborations', blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.institution})"

    class Meta:
        ordering = ['-start_date']

class Grant(MediaMixin):
    """Model for research grants."""
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    funding_agency = models.CharField(max_length=255)
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=10, default='CAD')
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    principal_investigators = models.ManyToManyField(
        LabMember, 
        related_name='primary_grants'
    )
    co_investigators = models.ManyToManyField(
        LabMember, 
        related_name='secondary_grants',
        blank=True
    )
    projects = models.ManyToManyField(Project, related_name='grants', blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.funding_agency})"

    class Meta:
        ordering = ['-start_date']

class Award(MediaMixin):
    """Model for awards received by the lab or its members."""
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    awarding_body = models.CharField(max_length=255)
    description = models.TextField()
    date_received = models.DateField()
    recipients = models.ManyToManyField(
        LabMember,
        related_name='awards',
        blank=True
    )
    projects = models.ManyToManyField(
        Project,
        related_name='awards',
        blank=True
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-date_received']

class Publication(MediaMixin):
    """Model for academic publications."""
    PUBLICATION_TYPES = [
        ('JOURNAL', 'Journal Article'),
        ('CONF', 'Conference Paper'),
        ('BOOK', 'Book'),
        ('CHAPTER', 'Book Chapter'),
        ('THESIS', 'Thesis'),
        ('REPORT', 'Technical Report'),
        ('OTHER', 'Other'),
    ]
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    publication_type = models.CharField(max_length=20, choices=PUBLICATION_TYPES)
    authors = models.ManyToManyField(
        LabMember,
        related_name='publications',
        blank=True
    )
    external_authors = models.TextField(
        blank=True, 
        help_text="Names of authors not in the lab, comma separated"
    )
    abstract = models.TextField(blank=True)
    journal = models.CharField(max_length=255, blank=True)
    conference = models.CharField(max_length=255, blank=True)
    volume = models.CharField(max_length=50, blank=True)
    issue = models.CharField(max_length=50, blank=True)
    pages = models.CharField(max_length=50, blank=True)
    year = models.IntegerField()
    month = models.IntegerField(blank=True, null=True)
    publisher = models.CharField(max_length=255, blank=True)
    doi = models.CharField(max_length=255, blank=True)
    url = models.URLField(blank=True)
    citation = models.TextField(blank=True)
    projects = models.ManyToManyField(
        Project,
        related_name='publications',
        blank=True
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-year', '-month']

class Partnership(MediaMixin):
    """Model for industry/academic partnerships."""
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    organization = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    website = models.URLField(blank=True)
    contact_name = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField(blank=True)
    projects = models.ManyToManyField(
        Project,
        related_name='partnerships',
        blank=True
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.organization})"

    class Meta:
        ordering = ['-start_date']
