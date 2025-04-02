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

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'

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

class PartnershipViewSet(viewsets.ModelViewSet):
    queryset = Partnership.objects.all()
    serializer_class = PartnershipSerializer
    lookup_field = 'slug'
