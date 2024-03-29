# Generated by Django 2.2.2 on 2022-01-25 01:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Plan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plan_id', models.IntegerField(default=0, verbose_name='計画ID')),
                ('prefectural_names', models.TextField(verbose_name='県名')),
                ('photo', models.ImageField(blank=True, null=True, upload_to='', verbose_name='メイン画像')),
                ('detail', models.TextField(verbose_name='詳細')),
                ('plan', models.TextField(verbose_name='旅行計画')),
                ('sub_details', models.TextField(verbose_name='サブ詳細一覧')),
                ('created_at', models.DateTimeField(auto_now_add=True, max_length=10, verbose_name='作成日時')),
                ('updated_at', models.DateTimeField(auto_now=True, max_length=10, null=True, verbose_name='更新日時')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='削除フラグ')),
                ('is_action', models.BooleanField(default=False, verbose_name='公開フラグ')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='ユーザー')),
            ],
            options={
                'verbose_name_plural': 'Plan',
            },
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='travel_planning.Plan', verbose_name='旅行計画')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='ユーザー')),
            ],
            options={
                'verbose_name_plural': 'Like',
            },
        ),
    ]
