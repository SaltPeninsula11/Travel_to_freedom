from django.urls import path
from . import views

app_name = 'travel_planning'
urlpatterns = [
    path('',views.SampleView.as_view(), name='smaple'),
]
