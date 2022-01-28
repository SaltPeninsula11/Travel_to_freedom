from re import template
from django.shortcuts import render
from django.views import generic
from django.contrib import messages

from django.http import JsonResponse
from .forms import MyPlanUpdateForm, MyPlanCreateForm
from django.urls import reverse_lazy

from .models import *
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.
# class MapView(generic.TemplateView):
#     template_name="map.html"
class IndexView(generic.TemplateView):
    template_name = "index.html"
    
class AutomapView(generic.CreateView):
    template_name = 'auto.html'
    model = Plan
    form_class = MyPlanCreateForm


class TestView(generic.TemplateView):
    template_name = "test.html"

class PlanListView(generic.ListView):
    model = Plan
    template_name = "plan_list.html"

    def get_queryset(self):
        plans = Plan.objects.filter(prefectural_names__contains='北海道').filter(is_action=True).order_by('-created_at')
        return plans

    def post(self, request, *args, **kwargs):
        plans = Plan.objects.filter(prefectural_names__contains=request.POST['prefs']).filter(is_action=True).order_by('-created_at')
        context = {
            'prefsValue' : request.POST['prefs'],
            'plan_list' : plans
        }
        return render(request, 'plan_list.html', context)

class SharePlanView(LoginRequiredMixin, generic.DetailView):
    model = Plan
    template_name = "shiozaki/share_plan.html"

    def get_context_data(self, **kwargs):
        plan = Plan.objects.get(id=self.kwargs['pk']).plan
        subD = Plan.objects.get(id=self.kwargs['pk']).sub_details
        detailList = subD.split(';')

        perPlace = plan.split(';')
        planList = []

        for i in range(len(perPlace)):
            place = perPlace[i].split(",")
            place.append(detailList[i] if i < len(detailList) else '')
            planList.append(place)
        
        context = {
            'object' : Plan.objects.get(id=self.kwargs['pk']),
            'planList' : planList,
        }
        return context

class ShareSuccessView(generic.TemplateView):
    def post(self, request, *args, **kwargs):
        context = {
            'mainPhoto': request.POST['メイン画像'],
            'mainDescription': request.POST['詳細'],
            'subDescription': request.POST.getlist('サブ詳細'),
        }
        subDes = ''
        for index in range(len(context['subDescription'])):
            subDes += context['subDescription'][index]
            if index != (len(context['subDescription'])-1):
                subDes += ';'

        Plan.objects.filter(id=request.POST['ID']).update(
            photo=context['mainPhoto'],
            detail=context['mainDescription'], 
            sub_details=subDes, is_action=True
        )
        return render(request, 'shiozaki/share_success.html')


class MyPlanListView(generic.ListView):
    model = Plan
    template_name = "my_plan_list.html"

    def get_queryset(self):
        plans = Plan.objects.filter(user=self.request.user).order_by('-created_at')
        return plans
    
    def post(self, request, *args, **kwargs):
        try:
            plan = Plan(user=request.user, prefectural_names=request.POST["prefectural_names"], plan=request.POST["plan"])
            plan.save()

            messages.success(request, '計画を保存しました。')
        except:
            messages.error(request, 'エラーが起きたようです。')

        return render(request, 'my_plan_list.html')

class MyPlanDetailView(generic.DetailView):
    model = Plan
    template_name = "shiozaki/plan_detail.html"

    def get_context_data(self, **kwargs):
        user = Plan.objects.get(id=self.kwargs['pk']).user
        plan = Plan.objects.get(id=self.kwargs['pk']).plan
        subD = Plan.objects.get(id=self.kwargs['pk']).sub_details
        detailList = subD.split(';')

        perPlace = plan.split(';')
        planList = []

        for i in range(len(perPlace)):
            place = perPlace[i].split(",")
            place.append(detailList[i] if i < len(detailList) else '')
            planList.append(place)
        
        context = {
            'object' : Plan.objects.get(id=self.kwargs['pk']),
            'planOwner' : user,
            'planList' : planList
        }
        return context

class MyPlanUpdateView(LoginRequiredMixin, generic.UpdateView):
    model = Plan
    template_name = 'auto.html'
    form_class = MyPlanUpdateForm

    def get_success_url(self):
        return reverse_lazy('travel_planning:mydetail', kwargs={'pk': self.kwargs['pk']})
    def form_valid(self, form):
        messages.success(self.request, '更新しました。')
        return super().form_valid(form)
    def form_invalid(self, form):
        messages.error(self.request, "更新に失敗しました。")
        return super().form_invalid(form)

