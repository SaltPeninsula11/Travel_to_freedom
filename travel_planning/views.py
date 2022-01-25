from django.shortcuts import render
from django.views import generic

from .models import *

# Create your views here.
# class MapView(generic.TemplateView):
#     template_name="map.html"
class IndexView(generic.TemplateView):
    template_name = "index.html"
    
class AutomapView(generic.TemplateView):
    template_name="auto.html"
    
    def pythonMethod(self, test):
        print("Here\'s variable :", test)
        #return "Hi!"

class TestView(generic.TemplateView):
    template_name = "test.html"

class SharePlanView(generic.TemplateView):
    template_name = "shiozaki/share_plan.html"

class PlanListView(generic.ListView):
    model = Plan
    template_name = "plan_list.html"

    def get_queryset(self):
        plans = Plan.objects.filter().order_by('-created_at')
        return plans

class ShareResultView(generic.TemplateView):
    def post(self, request, *args, **kwargs):
        print(request.POST['メイン画像'])

        context = {
            'mainPhoto': request.POST['メイン画像'],
            'mainDescription': request.POST['詳細'],
            'subDescription0': request.POST['サブ詳細0'],
            'subDescription1': request.POST['サブ詳細1'],
        }
        return render(request, 'shiozaki/share_results.html', context)