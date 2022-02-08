from django.shortcuts import render
from django.views import generic
from django.contrib import messages

from .forms import MyPlanUpdateForm, MyPlanCreateForm
from django.urls import reverse_lazy

from .models import *
from django.contrib.auth.mixins import LoginRequiredMixin

from config import settings
import os

# Create your views here.
class IndexView(generic.TemplateView):
    template_name = "index.html"
    
class AutomapView(generic.CreateView):
    template_name = 'auto.html'
    model = Plan
    form_class = MyPlanCreateForm

    def post(self, request, *args, **kwargs):
        try:
            plan = Plan(user=request.user, prefectural_names=request.POST["prefectural_names"], plan=request.POST["plan"])
            plan.save()

            messages.success(request, '計画を保存しました。')
        except:
            messages.error(request, 'エラーが起きたようです。')
        return render(request, 'auto.html')


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
        context = super().get_context_data(**kwargs)

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
            'mainPhoto': request.FILES['メイン画像'],
            'mainDescription': request.POST['詳細'],
            'subDescription': request.POST.getlist('サブ詳細'),
        }
        subDes = ''
        for index in range(len(context['subDescription'])):
            subDes += context['subDescription'][index]
            if index != (len(context['subDescription'])-1):
                subDes += ';'

        os.chdir(os.getcwd() + settings.MEDIA_URL)

        file_obj = request.FILES.get("メイン画像")
        f1=open(file_obj.name,"wb")

        for i in file_obj.chunks():
            f1.write(i)

        f1.close()

        os.chdir('..')

        Plan.objects.filter(id=request.POST['ID']).update(
            photo=context['mainPhoto'],
            detail=context['mainDescription'], 
            sub_details=subDes, is_action=True
        )
        return render(request, 'shiozaki/share_success.html')

class ShareCanceledView(generic.TemplateView):
    #共有取り消しビュー（塩﨑）
    def post(self, request, *args, **kwargs):
        Plan.objects.filter(id=request.POST['ID']).update(
            is_action=False
        )
        return render(request, 'shiozaki/share_canceled.html')


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
        context = super().get_context_data(**kwargs)
        
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
    #問題点：他人の計画を編集できてしまう
    """
    注意！
    仕様のため、保存ボタンを押さないとエラーが起きません！
    """
    model = Plan
    template_name = 'auto.html'
    form_class = MyPlanUpdateForm

    def get_success_url(self):
        return reverse_lazy('travel_planning:mydetail', kwargs={'pk': self.kwargs['pk']})
    def form_valid(self, form):
        if Plan.objects.get(id=self.kwargs['pk']).user == self.request.user:
            messages.success(self.request, '更新しました。')
            return super().form_valid(form)
        else:
            messages.error(self.request, "更新に失敗しました。")
            return super().form_invalid(form)

    def form_invalid(self, form):
        messages.error(self.request, "更新に失敗しました。")
        return super().form_invalid(form)
#追加コード（塩崎）
class MyPlanDeleteView(LoginRequiredMixin, generic.DeleteView):
    #削除ビュー
    model = Plan
    template_name = 'shiozaki/share_delete.html'
    success_url = reverse_lazy('travel_planning:mylist')

    def delete(self, request, *args, **kwargs):
        #削除フラグ使う・・・？
        messages.success(self.request, "計画を削除しました。")
        return super().delete(request, *args, **kwargs)

class PlanCopyView(LoginRequiredMixin, generic.CreateView):
    #コピーに使うビュー
    #問題点：自分の計画をコピーできてしまう（多分）
    model = Plan
    template_name = 'auto.html'
    form_class = MyPlanCreateForm

    def get_context_data(self, **kwargs):
        try:
            if Plan.objects.get(id=self.kwargs['pk']).user == self.request.user:
                messages.error(self.request, "エラーが起こりました。")

                return {}
            else:
                #URLにあるPKから計画一覧を取得
                plan = Plan.objects.get(id=self.kwargs['pk']).plan

                context = {
                    'copiedPlan' : plan
                }
                return context
        except self.model.DoesNotExist:
            messages.error(self.request, "エラーが起こりました。")
            return {}