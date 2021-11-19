from django.shortcuts import render
from django.views import generic

# Create your views here.
class MapView(generic.TemplateView):
    template_name="map.html"

class AutomapView(generic.TemplateView):
    template_name="auto.html"