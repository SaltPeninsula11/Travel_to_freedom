# Schedule_management
# 開発環境について
## 開発について
#### Dockerを使った開発開始のコマンド
1. $git pull origin <ブランチ名>
2. $docker-compose up --build -d
#docker-compose.ymlを元にコンテナの作成 
※Creating schedule_management_app_1 ... done が出ればOK
3. $docker-compose exec app bash 
#1.で作成されているコンテナ内に入る 
※入っていると$root@<適当数字>:/Django になっている
4. $pipenv install --system 
#pipenvで管理しているパッケージをコンテナ内に適用
#### Dockerを使った開発終了のコマンド
1. $exit #コンテナから出る 
※コンテナ内なのかを確認
2. $docker-compose down 
#コンテナ,イメージ,ボリュームの削除 
※やらないとコンテナ関係の残骸が溜まってPCの容量を食う
3. $git add .
4. $git commit -m <コメント>
5. $git push origin <ブランチ名>
※ブランチ名が長くてめんどくさい場合は、$git push でもok(現在のブランチ名を要確認)
6. GitHubからpull requestを出す
#### Dockerを使わない開発開始のコマンド
1. $git pull origin <ブランチ名>
2. $pipenv install
3. $pipenv shell
#### Dockerを使わない開発終了のコマンド
1. $exit
2. $git add .
3. $git commit -m <コメント>
4. $git push origin <ブランチ名>
※ブランチ名が長くてめんどくさい場合は、$git push でもok(現在のブランチ名を要確認)
## Dockerのコマンド
```
$docker-compose up --build -d #コンテナの起動 -dオプションでバックエンド起動許可
$docker-compose exec app bash #コンテナ内に入る
$docker-compose down #コンテナ,イメージ,ボリュームの削除 ※やらないとコンテナ関係の残骸が溜まってPCの容量を食う
$docker ps -a #コンテナが動いているか確認 ※動いている場合STATUS項目がUp、閉じている場合はExitedになっている
$docker images #コンテナのイメージ一覧を表示
```
## Pipenvのコマンド
```
$pipenv install <パッケージ> #パッケージをインストールする時 ※pip install <パッケージ> とやっていることは同じ
$pipenv install --system #pipenvが持っているパッケージをローカルに全てインストール
$pipenv shell #仮想環境に入る ※VSCodeのshellの所がpipenvになっていればOK
$exit #pipenvの仮想環境から出る
```
## Gitコマンド
```
$git clone <SSHurl>
$git pull remote <ブランチ名> #GitHubから指定したブランチの内容をfeath+margeする ※$git pull --allで全てのブランチの変更をpull
$git fetch <SSHurl> #GitHubからコードをステージに適用
$git marge #ステージの内容をワークツリーに適用
$git add <ファイル名> #ワークツリーの変更箇所をステージ ※$git add . ワークツリーの変更を全てステージにあげる
$git commit -m <コメント> #ステージに上がっている変更を確定 ※例：git commit -m "[add] 開発環境の構築"
$git push origin <ブランチ名> #確定している変更を指定したブランチにpush

※git commit -m <コメント>について
[update]・・・機能修正(バグ関係ではない)
[add]・・・新規ファイル追加
[fix]・・・バグ修正
[remove]・・・削除(ファイル)
例：$git commit -m "[update] カレンダー機能の追加" $git commit -m "[add] 開発環境の構築"
```
## GitHubのbranchについて
- main #デプロイ用
    - hotfix #リリース,デプロイ後のバグ修正
    - develop #開発用
        - feature/#~ #機能作成時に使用
        - release #リリース,デプロイの準備用
        - bugfix #開発中に見つけたバグを修正