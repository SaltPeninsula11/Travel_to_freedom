from django.urls import path
from . import views

app_name = 'travel_planning'
urlpatterns = [
    # path('',views.MapView.as_view(), name='map'),
    path('', views.IndexView.as_view(), name='index'),
    path('automap/',views.AutomapView.as_view(), name='automap'),
    # path('test/', views.TestView.as_view(), name='test')
    path('share/detail/<int:pk>/', views.SharePlanView.as_view(), name='share'),
    
    path('share/plan-list', views.PlanListView.as_view(), name='list'),
    path('share/result', views.ShareResultView.as_view(), name='result'),
    
    path('my-plan-list', views.MyPlanListView.as_view(), name='mylist'),
    path('plan-detail/<int:pk>', views.MyPlanDetailView.as_view(), name='mydetail'),
]
