from django.shortcuts import render
from rest_framework import viewsets
from .models import (
    LabMember, Project, Collaboration, Grant, 
    Award, Publication, Partnership
)
from .serializers import (
    LabMemberSerializer, ProjectSerializer, CollaborationSerializer,
    GrantSerializer, AwardSerializer, PublicationSerializer,
    PartnershipSerializer
)

# Create your views here.

class LabMemberViewSet(viewsets.ModelViewSet):
    queryset = LabMember.objects.all()
    serializer_class = LabMemberSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Print number of members for debugging
        members = LabMember.objects.all()
        print(f"LabMemberViewSet: Found {members.count()} members")
        for member in members:
            print(f"- {member.name} ({member.member_type})")
        return members

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Print number of projects for debugging
        projects = Project.objects.all()
        print(f"ProjectViewSet: Found {projects.count()} projects")
        for project in projects:
            print(f"- {project.title} (Active: {project.is_active})")
        return projects

class CollaborationViewSet(viewsets.ModelViewSet):
    queryset = Collaboration.objects.all()
    serializer_class = CollaborationSerializer
    lookup_field = 'slug'

class GrantViewSet(viewsets.ModelViewSet):
    queryset = Grant.objects.all()
    serializer_class = GrantSerializer
    lookup_field = 'slug'

class AwardViewSet(viewsets.ModelViewSet):
    queryset = Award.objects.all()
    serializer_class = AwardSerializer
    lookup_field = 'slug'

class PublicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Print number of publications for debugging
        publications = Publication.objects.all()
        print(f"PublicationViewSet: Found {publications.count()} publications")
        for pub in publications:
            print(f"- {pub.title} ({pub.year})")
        return publications

class PartnershipViewSet(viewsets.ModelViewSet):
    queryset = Partnership.objects.all()
    serializer_class = PartnershipSerializer
    lookup_field = 'slug'
