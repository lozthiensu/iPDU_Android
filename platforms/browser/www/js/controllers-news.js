angular.module('pduNewsApp')
.controller('page_News_Ctrl', function ($scope, pduService, $rootScope, $timeout, localStorageService, $cordovaSQLite, $cordovaFileTransfer, $cordovaFile, $cordovaSocialSharing, $cordovaStatusbar) {


    $scope.dataListNews = []; //Contain data thread get from sever


    //Get list id thread saved
    $rootScope.listIDSaved = localStorageService.get('listIDSaved');
    if (!$rootScope.listIDSaved) {
        $rootScope.listIDSaved = [{
            Id: -1
        }];
    }


    //Save thread to SQLite
    $scope.saveToSQLite = function (idBaiViet) {
        $scope.saved = [];
        $scope.listImgFromSever = idBaiViet.Img;
        var numFor = $scope.listImgFromSever.length;
        for (var i = 0; i < numFor; i++) {
            var url = $scope.listImgFromSever[i].Url;
            var filename = url.split("/").pop();
            var targetPath = cordova.file.dataDirectory + filename;
            var trustHosts = true;
            var options = {};
            $scope.saved.push({
                Url: targetPath
            });
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                .then(function (result) {}, function (error) {
                    // Error 
                }, function (progress) {
                    $timeout(function () {
                        $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                    })
                });

        }
        var textBefore = idBaiViet.Content;
        var textAfter = '';
        var dem = 0;
        numFor = textBefore.length;
        for (var z = 0; z < numFor; z++) {
            if (textBefore[z] == 's' && textBefore[z + 1] == 'r' && textBefore[z + 2] == 'c') {
                var start = z + 5;
                textAfter += "src='";
                textAfter += $scope.saved[dem].Url;
                while (textBefore[start + 1] != '>') {
                    start++;
                }
                textAfter += "'";
                z = start;
                dem++;
            } else
                textAfter += textBefore[z];
        }
        var textAfter1 = textAfter.replace(/slideHinh/g, "slideHinhSave");
        var textAfter2 = textAfter1.replace(/datapdu.Img/g, "datapdu.baiviet_img");
        textAfter = textAfter2;
        var imgList = JSON.stringify($scope.saved);
        var numForx = $scope.listImgFromSever.length;
        var imgThumb = '';
        if (numForx == 0)
            imgThumb = "No";
        else if (numForx > 0)
            imgThumb = JSON.stringify($scope.saved[0].Url);
        $scope.tempListId = $rootScope.listIDSaved;
        $scope.tempListId.push({
            Id: idBaiViet.Id + 'home'
        });
        localStorageService.set('listIDSaved', $scope.tempListId);
        $cordovaSQLite.execute($rootScope.db, "INSERT INTO sqlSave (baiviet_id, baiviet_title, baiviet_date, baiviet_author, baiviet_content, baiviet_img, baiviet_thumb) VALUES (?,?,?,?,?,?,?)", [$scope.datapdu[0].Id + 'news', $scope.datapdu[0].Title, $scope.datapdu[0].Date, $scope.datapdu[0].Author, textAfter, imgList, imgThumb]).then(function (res) {}, function (err) {
            console.error(err);
        });
    };


    //Delete thread from SQLite
    $scope.deleteToSQLite = function (idBaiViet) {
        //Delete all image has saved in disk
        $scope.listImgSaved = idBaiViet.Img;
        var numFor = $scope.listImgSaved.length;
        for (var i = 0; i < numFor; i++) {
            var url = $scope.listImgSaved[i].Url;
            var filename = url.split("/").pop();
            $cordovaFile.removeFile(cordova.file.dataDirectory, filename)
                .then(function (success) {}, function (error) {});
        }
        //Remove id thread from list id saved
        $scope.tempListId = $rootScope.listIDSaved;
        var tongSoBai = $scope.tempListId.length;
        for (var i = 0; i < tongSoBai; i++) {
            if ($scope.tempListId[i].Id === idBaiViet.Id + 'news') {
                $scope.tempListId.splice(i, 1);
                localStorageService.set('listIDSaved', $scope.tempListId);
                break;
            }
        }
        //Delete thread from SQLite
        $cordovaSQLite.execute($rootScope.db, "DELETE FROM sqlSave WHERE baiviet_id = ?", [idBaiViet.Id + 'news']).then(function (res) {});
    };


    //Check thread has saved on SQLite
    $scope.tonTai = false;
    $scope.checkTonTai = function (idBaiViet) {
        $scope.tempListId = $rootScope.listIDSaved;
        $scope.tonTai = false;
        var n = $scope.tempListId.length;
        for (var i = 0; i < n; i++) {
            if (idBaiViet.Id + 'home' === $scope.tempListId[i].Id) {
                $scope.tonTai = true;
                break;
            }
        }
        return $scope.tonTai;
    };


    //Determnie status model view thread
    $scope.classHienThiBaiViet = "modal animated fadeOutRightBig";
    $scope.getTrangThaiModal = function () {
        if ($scope.classHienThiBaiViet === "modal animated fadeInRightBig")
            $scope.classHienThiBaiViet = "modal animated fadeOutRightBig";
        else
            $scope.classHienThiBaiViet = "modal animated fadeInRightBig";
    };


    //Set font size from frontend
    $scope.setCurrentsizeFont = function (index) {
        $rootScope.settingData[0].sizeFont = index;
    };
    $scope.isCurrentsizeFont = function (index) {
        localStorageService.set('settingData', [{
            "sizeFont": index
            , "nightMode": $rootScope.settingData[0].nightMode
        }]);
        $scope.Switch();
        if ($rootScope.settingData[0].sizeFont == 1)
            $rootScope.cssFontSize = "font1";
        else if ($rootScope.settingData[0].sizeFont == 2)
            $rootScope.cssFontSize = "font2";
        else if ($rootScope.settingData[0].sizeFont == 3)
            $rootScope.cssFontSize = "font3";
        else
            $rootScope.cssFontSize = "font4";
        return $rootScope.settingData[0].sizeFont == index;
    };


    //Switch betweenbetween night and day mode view
    $scope.Switch = function () {
        localStorageService.set('settingData', [{
            "sizeFont": $rootScope.settingData[0].sizeFont
            , "nightMode": $rootScope.settingData[0].nightMode
        }]);
        if ($rootScope.settingData[0].nightMode === true) {
            $cordovaStatusbar.style(1);
            $rootScope.cssModalHeaderSetting = "modal-header-setting     modal-header-setting-night";
            $rootScope.cssModeModalHeader = "modal-header             modal-header-night";
            $rootScope.cssModeModalCat = "modal-header-theloai     modal-header-theloai-night";
            $rootScope.cssModalContent = "xem_baiviet_bogoc_modal  xem_baiviet_bogoc_modal-night";
            $rootScope.cssModeHeader = "menu_header              menu_header-night";
            $rootScope.cssListThread = "list_baiviet             list_baiviet-night";
            $rootScope.cssModalCat = "modal-content-theloai    modal-content-theloai-night";
            $rootScope.cssModal = "modal-content            modal-content-night";
            $rootScope.cssMenuOther = "list_menu                list_menu-night";
            $rootScope.cssModeFooter            = "menu_footer              menu_footer-night";
        } else {
            $cordovaStatusbar.style(0);
            $rootScope.cssModalHeaderSetting = "modal-header-setting";
            $rootScope.cssModeModalHeader = "modal-header";
            $rootScope.cssModeModalCat = "modal-header-theloai";
            $rootScope.cssModalContent = "xem_baiviet_bogoc_modal";
            $rootScope.cssModeHeader = "menu_header";
            $rootScope.cssListThread = "list_baiviet";
            $rootScope.cssModalCat = "modal-content-theloai";
            $rootScope.cssModal = "modal-content";
            $rootScope.cssMenuOther = "list_menu";
            $rootScope.cssModeFooter            = "menu_footer";
        }
    };

    
    //Function handle get data from sever   
    $scope.getDataFromSever = function () {
        //$scope.noMoreItemsAvailable = false;
        pduService.News_getPage().success(function (data) {
            var n = data.length
                , i = 0;
            if (n < 1)
                $scope.noMoreItemsAvailable = true;
            for (; i < n; i++)
                $scope.dataListNews.push(data[i]);
        });

    };


    //Get data from sever
    $scope.showData = function () { 
        $timeout(function(){
            $scope.getDataFromSever(); 
        }, 200); 
        $scope.noMoreItemsAvailable = true;
    };
    $scope.showData();

    
    //Opening view modal and show thread
    $scope.showDataId = function (idBaiViet) {
        pduService.News_getId(idBaiViet.Id).success(function (datapdus) {
            $scope.datapdu = datapdus;
        });
        $scope.getTrangThaiModal();
    };


    //Share function
    $scope.shareTo = function () {
        $cordovaSocialSharing.share("Mời xem ...", $scope.datapdu[0].Title, null, "http://www.pdu.edu.vn/cntt/#article/" + $scope.datapdu[0].Id)
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured
            });
    };


    //Set img to zoom
    $scope.zoomThisImage = function (url, data) {
        PhotoViewer.show(data[url].Url, $scope.datapdu[0].Title); 
    };


    //Close view modal and destroy data
    $scope.huyData = function () {
        $scope.getTrangThaiModal();
        $timeout(function () {
            $scope.dismiss();
            $scope.datapdu = [];
        }, 300);
    };


});