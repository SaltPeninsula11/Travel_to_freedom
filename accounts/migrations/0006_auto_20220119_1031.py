# Generated by Django 2.2.2 on 2022-01-19 01:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_auto_20220113_1444'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='gender',
            field=models.CharField(choices=[('男性', '男性'), ('女性', '女性')], default='男性', max_length=2, verbose_name='性別'),
        ),
    ]
