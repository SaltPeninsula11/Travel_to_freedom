# Generated by Django 2.2.2 on 2022-01-13 03:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='age',
            field=models.IntegerField(default=20, verbose_name='年齢'),
        ),
    ]