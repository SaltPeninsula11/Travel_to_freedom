from django import forms
from .models import Plan

class MyPlanCreateForm(forms.ModelForm):
    class Meta:
        model = Plan
        fields = ('prefectural_names','plan')
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)


class MyPlanUpdateForm(forms.ModelForm):
    class Meta:
        model = Plan
        fields = ('prefectural_names','plan')
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)