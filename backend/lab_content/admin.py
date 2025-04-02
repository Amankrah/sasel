from django.contrib import admin
from .models import (
    LabMember, Project, Collaboration, Grant, 
    Award, Publication, Partnership
)

@admin.register(LabMember)
class LabMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'member_type', 'position', 'is_active')
    list_filter = ('member_type', 'is_active')
    search_fields = ('name', 'bio', 'position')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('members',)

@admin.register(Collaboration)
class CollaborationAdmin(admin.ModelAdmin):
    list_display = ('name', 'institution', 'collaboration_type', 'is_active')
    list_filter = ('collaboration_type', 'is_active')
    search_fields = ('name', 'institution', 'description')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('projects',)

@admin.register(Grant)
class GrantAdmin(admin.ModelAdmin):
    list_display = ('title', 'funding_agency', 'start_date', 'end_date', 'is_active')
    list_filter = ('funding_agency', 'is_active')
    search_fields = ('title', 'description', 'funding_agency')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('principal_investigators', 'co_investigators', 'projects')

@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ('title', 'awarding_body', 'date_received')
    list_filter = ('awarding_body',)
    search_fields = ('title', 'description', 'awarding_body')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('recipients', 'projects')

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('title', 'publication_type', 'year', 'month')
    list_filter = ('publication_type', 'year')
    search_fields = ('title', 'abstract', 'journal', 'conference', 'external_authors')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('authors', 'projects')

@admin.register(Partnership)
class PartnershipAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'organization', 'description')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('projects',)
