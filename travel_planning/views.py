from django.shortcuts import render
from django.views import generic

# Create your views here.
class SampleView(generic.TemplateView):
    template_name="sample.html"