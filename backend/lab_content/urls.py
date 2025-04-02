from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# Register API viewsets here
router.register(r'members', views.LabMemberViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'collaborations', views.CollaborationViewSet)
router.register(r'grants', views.GrantViewSet)
router.register(r'awards', views.AwardViewSet)
router.register(r'publications', views.PublicationViewSet)
router.register(r'partnerships', views.PartnershipViewSet)

urlpatterns = router.urls 