from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django import forms

class SignupForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model   = CustomUser
        fields  = ("username", "email", "password1", "password2", "gender", "age")

        widgets = {
            'gender': forms.RadioSelect()
        }

        help_texts = {
            'username': None,
            'password1': None,
            'password2': None,
        }