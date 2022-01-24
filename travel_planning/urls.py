from django.urls import path
from . import views

app_name = 'travel_planning'
urlpatterns = [
    # path('',views.MapView.as_view(), name='map'),
    path('', views.IndexView.as_view(), name='index'),
    path('automap/',views.AutomapView.as_view(), name='automap'),
    # path('test/', views.TestView.as_view(), name='test')
    path('share/', views.SharePlanView.as_view(), name='share'),
]
