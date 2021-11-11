from django.urls import path
from . import views

app_name = 'travel_planning'
urlpatterns = [
    path('',views.MapView.as_view(), name='map'),
]
