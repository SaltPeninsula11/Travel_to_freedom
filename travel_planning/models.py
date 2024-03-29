from django.db import models
from accounts.models import CustomUser

import os
import time
from datetime import datetime

#旅行計画モデル
class Plan(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name='ユーザー', on_delete=models.PROTECT)
    prefectural_names = models.TextField(verbose_name='県名') #例：'千葉県,東京都'
    photo = models.ImageField(verbose_name='メイン画像', blank=True, null=True)
    detail = models.TextField(verbose_name='詳細')
    plan = models.TextField(verbose_name='旅行計画') #例：'牛久大仏,ChIJ4-9ANlRuImARS4u9SEpdN8I,986,60;浄土宗 佛法山 東漸寺,ChIJeakrKlKbGGAR3PKsg0N6oFQ,1110,60;'、splitで展開
    sub_details = models.TextField(verbose_name='サブ詳細一覧') #例：'詳細1;詳細2;'
    created_at = models.DateTimeField(verbose_name='作成日時', max_length=10, auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', max_length=10, auto_now=True, blank=True, null=True)
    is_deleted = models.BooleanField(verbose_name='削除フラグ', default=False)
    is_action = models.BooleanField(verbose_name='公開フラグ', default=False)

    class Meta:
        verbose_name_plural = 'Plan'
    
    def __str__(self):
        string = self.plan.split(",")
        return string[0] #例：20代男性
    
    def ago(self):
        dt_now = time.time() #現在時刻
        dt_updated = self.updated_at.timestamp() #更新日の取得
        
        diff = dt_now - dt_updated #差分
        
        d = datetime.utcfromtimestamp(diff)
        
        if d.year - 1970:
            return str(d.year - 1970) + "年前"
        elif d.month - 1:
            return str(d.month - 1) + "ヵ月前"
        elif d.day - 1:
            return str(d.day) + "日前"
        elif d.hour:
            return str(d.hour) + "時間前"
        elif d.minute:
            return str(d.minute) + "分前"
        else:
            return "数秒前"

#いいねモデル（未使用）
class Like(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name='ユーザー', on_delete=models.PROTECT)
    plan = models.ForeignKey(Plan, verbose_name='旅行計画', on_delete=models.PROTECT)

    class Meta:
        verbose_name_plural = 'Like'
    
    def __str__(self):
        return self.user.username #仮です！