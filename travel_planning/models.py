from django.db import models
from accounts.models import CustomUser

#旅行計画モデル
class Plan(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name='ユーザー', on_delete=models.PROTECT)
    plan_id = models.IntegerField(verbose_name='計画ID', default=0)
    # prefectural_name = models.ForeignKey(PrefecturalName, verbose_name='県名', on_delete=models.PROTECT) #複数にしよう！
    prefectural_names = models.TextField(verbose_name='県名') #例：'千葉県,東京都'
    photo = models.ImageField(verbose_name='メイン画像', blank=True, null=True)
    detail = models.TextField(verbose_name='詳細')
    plan = models.TextField(verbose_name='旅行計画') #例：'ABC,10:00,11:00,;,DEF,11:30,12:30,;'、splitで展開
    created_at = models.DateTimeField(verbose_name='作成日時', max_length=10, auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', max_length=10, auto_now=True, blank=True, null=True)
    is_deleted = models.BooleanField(verbose_name='削除フラグ', default=False)
    is_action = models.BooleanField(verbose_name='公開フラグ', default=False)

    class Meta:
        verbose_name_plural = 'Plan'
    
    def __str__(self):
        return str((self.user.age // 10) * 10) + "代" + self.user.gender #例：20代男性

#いいねモデル
class Like(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name='ユーザー', on_delete=models.PROTECT)
    plan = models.ForeignKey(Plan, verbose_name='旅行計画', on_delete=models.PROTECT)

    class Meta:
        verbose_name_plural = 'Like'
    
    def __str__(self):
        return self.user.username #仮です！