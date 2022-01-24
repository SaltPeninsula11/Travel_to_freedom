from django.shortcuts import render
from django.views import generic

# Create your views here.
# class MapView(generic.TemplateView):
#     template_name="map.html"
class IndexView(generic.TemplateView):
    template_name = "index.html"
    
class AutomapView(generic.TemplateView):
    template_name="auto.html"

class TestView(generic.TemplateView):
    template_name = "test.html"

class SharePlanView(generic.TemplateView):
    template_name = "shiozaki/share_plan.html"