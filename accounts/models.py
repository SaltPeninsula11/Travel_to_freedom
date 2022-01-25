from django.contrib.auth.models import AbstractUser
from django.db import models

GENDER_CHOICES = [
    ('男性', '男性'),
    ('女性', '女性'),
]

# Create your models here.
class CustomUser(AbstractUser):
    class Meta:
        verbose_name_plural = 'CustomUser'

    gender = models.CharField(verbose_name="性別", default="男性", choices=GENDER_CHOICES, max_length=2)
    age = models.IntegerField(verbose_name="年齢",default=20)

    REQUIRED_FIELDS = ['email', 'gender', 'age']