from django.urls import path
from . import views

app_name = 'travel_planning'
urlpatterns = [
    # path('',views.MapView.as_view(), name='map'),
    path('', views.IndexView.as_view(), name='index'),
    path('automap/',views.AutomapView.as_view(), name='automap'),
    path('automap/<int:pk>/',views.MyPlanUpdateView.as_view(), name='plan-update'),
    # path('test/', views.TestView.as_view(), name='test')
    path('share/detail/<int:pk>/', views.SharePlanView.as_view(), name='share'),
    
    path('share/plan-list', views.PlanListView.as_view(), name='list'),
    path('share/success', views.ShareSuccessView.as_view(), name='success'),
    
    path('my-plan-list', views.MyPlanListView.as_view(), name='mylist'),
    path('plan-detail/<int:pk>', views.MyPlanDetailView.as_view(), name='mydetail'),

    path('map_copy/<int:pk>/',views.PlanCopyView.as_view(), name='plan-copy'),
]
