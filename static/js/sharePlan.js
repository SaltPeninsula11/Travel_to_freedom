function OnFileSelect( inputElement )
{
    // ファイルリストを取得
    var fileList = inputElement.files;
 
    // ファイルの数を取得
    var fileCount = fileList.length;
 
    var loadCompleteCount = 0;
    var imageList = "";
 
    // 選択されたファイルの数だけ処理する
    for ( var i = 0; i < fileCount; i++ ) {
        // FileReaderを生成
        var fileReader = new FileReader();
 
        // ファイルを取得
        var file = fileList[i];
 
        // 読み込み完了時の処理を追加
        fileReader.onload = function() {
            imageList = this.result;
 
            if ( ++loadCompleteCount == fileCount ) {
                document.getElementById("mainPhotoDisplay").src = imageList;
            }
        };
 
        // ファイルの読み込み(Data URI Schemeの取得)
        fileReader.readAsDataURL( file );
    }
}