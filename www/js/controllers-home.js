angular.module('pduNewsApp')
.controller('page_Home_Ctrl', function ($scope, pduService, $rootScope, $timeout, localStorageService, $cordovaSQLite, $cordovaFileTransfer, $cordovaFile, $cordovaSocialSharing, $cordovaStatusbar, $cordovaInAppBrowser, $cordovaProgress, $cordovaSpinnerDialog, $cordovaDialogs) {

    
    //Open link from this view
    $scope.openWeb = function(url){
        $cordovaInAppBrowser.open(url, '_system');
        delete url;
    };
    
    
    //Contain data thread get from sever
    $scope.dataListHome = []; 

    
    //Get list id thread saved
    $rootScope.listIDSaved = localStorageService.get('listIDSaved');
    if (!$rootScope.listIDSaved) {
        $rootScope.listIDSaved = [{ Id: -1 }];
    }

    
    //Save thread to SQLite
    $scope.saveToSQLite = function (idBaiViet) {
        $scope.startDownload = 0;
        //Save all image in this thread
        $scope.saved = [];
        $scope.listImgFromSever = idBaiViet.Img;
        numFor = $scope.listImgFromSever.length;
        for (i = 0; i < numFor; i++) {
            //Decode url image file name
            url = $scope.listImgFromSever[i].Url;
            url = decodeURI(url);
            filename = url.split("/").pop();
            //Convert to vietnamese unsigned
            filename= filename.toLowerCase(); 
            filename= filename.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ  |ặ|ẳ|ẵ/g,"a"); 
            filename= filename.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
            filename= filename.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
            filename= filename.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ  |ợ|ở|ỡ/g,"o"); 
            filename= filename.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
            filename= filename.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
            filename= filename.replace(/đ/g,"d");
            //Replace specical character to -
            filename= filename.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
            //Replace -- to -
            filename= filename.replace(/-+-/g,"-");
            //Remove - in the first char
            filename= filename.replace(/^\-+|\-+$/g,"");
            targetPath = cordova.file.dataDirectory + filename;
            trustHosts = true;
            options = {};
             $scope.saved.push({
                Url: targetPath
            });
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
            .then(function (result) {}, function (error) {
            }, function (progress) {
                intFirst = parseInt($scope.startDownload);
                if( intFirst == 0 ){
                    $cordovaSpinnerDialog.show("","Đang tải", true);
                    $scope.startDownload = 1;
                }
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;                intFirst = parseInt($scope.downloadProgress);
                if( intFirst >= 100 ){
                    $cordovaSpinnerDialog.hide();
                }
            });
        }
        //Edit content to save
        textBefore = idBaiViet.Content;
        textAfter = '';
        dem = 0;
        numFor = textBefore.length;
        for (z = 0; z < numFor; z++) {
            if (textBefore[z] == 's' && textBefore[z + 1] == 'r' && textBefore[z + 2] == 'c') {
                start = z + 5;
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
        textAfter = textAfter.replace(/slideHinh/g, "slideHinhSave");
        textAfter = textAfter.replace(/datapdu.Img/g, "datapdu.baiviet_img");
        imgList = JSON.stringify($scope.saved);
        numForx = $scope.listImgFromSever.length;
        imgThumb = '';
        if (numForx == 0)
            imgThumb = "No";
        else if (numForx > 0)
            imgThumb = JSON.stringify($scope.saved[0].Url);
        $scope.tempListId = $rootScope.listIDSaved;
        $scope.tempListId.push({
            Id: idBaiViet.Id + 'home'
        });
        //Save in to SQLite and list id thread has save
        localStorageService.set('listIDSaved', $scope.tempListId);
        $cordovaSQLite.execute($rootScope.db, "INSERT INTO sqlSave (baiviet_id, baiviet_title, baiviet_date, baiviet_author, baiviet_content, baiviet_img, baiviet_thumb) VALUES (?,?,?,?,?,?,?)", [$scope.datapdu[0].Id + 'home', $scope.datapdu[0].Title, $scope.datapdu[0].Date, $scope.datapdu[0].Author, textAfter, imgList, imgThumb]).then(function (res) {}, function (err) {
            console.error(err);
        });
        //Delete all variable to save memory
        delete numFor; delete i; delete url; delete filename; delete targetPath; delete trustHosts;  delete options; delete filePathNew; delete textBefore; delete textAfter; delete dem; delete start; delete z; delete imgList; delete imgThumb; delete numForx; delete $scope.saved; delete $scope.listImgFromSever; delete intFirst; delete $scope.downloadProgress;
    };


    //Delete thread from SQLite
    $scope.deleteToSQLite = function (idBaiViet) {
        //Delete all image has saved in disk
        $scope.listImgSaved = idBaiViet.Img;
        numFor = $scope.listImgSaved.length;
        for (i = 0; i < numFor; i++) {
            //Decode url image file name
            url = $scope.listImgSaved[i].Url;
            url = decodeURI(url);
            filename = url.split("/").pop();
            //Convert to vietnamese unsigned
            filename= filename.toLowerCase(); 
            filename= filename.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ  |ặ|ẳ|ẵ/g,"a"); 
            filename= filename.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
            filename= filename.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
            filename= filename.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ  |ợ|ở|ỡ/g,"o"); 
            filename= filename.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
            filename= filename.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
            filename= filename.replace(/đ/g,"d");
            //Replace specical character to -
            filename= filename.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
            //Replace -- to -
            filename= filename.replace(/-+-/g,"-");
            //Remove - in the first char
            filename= filename.replace(/^\-+|\-+$/g,"");
            $cordovaFile.removeFile(cordova.file.dataDirectory, filename)
                .then(function (success) {}, function (error) {});
        }
        //Remove id thread from list id saved
        $scope.tempListId = $rootScope.listIDSaved;
        tongSoBai = $scope.tempListId.length;
        for (i = 0; i < tongSoBai; i++) {
            if ($scope.tempListId[i].Id == idBaiViet.Id + 'home') {
                $scope.tempListId.splice(i, 1);
                localStorageService.set('listIDSaved', $scope.tempListId);
                break;
            }
        }
        //Delete thread from SQLite
        $cordovaSQLite.execute($rootScope.db, "DELETE FROM sqlSave WHERE baiviet_id = ?", [idBaiViet.Id + 'home']).then(function (res) {});
        delete numFor; delete i; delete url; delete filename; delete tongSoBai; delete $scope.listImgSaved; delete $scope.tempListId;
    };


    //Check thread has saved on SQLite
    $scope.tonTai = false;
    $scope.checkTonTai = function (idBaiViet) {
        $scope.tempListId = $rootScope.listIDSaved;
        $scope.tonTai = false;
        n = $scope.tempListId.length;
        for (i = 0; i < n; i++) {
            if (idBaiViet.Id + 'home' == $scope.tempListId[i].Id) {
                $scope.tonTai = true;
                break;
            }
        }
        delete n; delete i; delete $scope.tempListId;
        return $scope.tonTai;
    };


    //Determnie status model view thread
    $rootScope.classHienThiBaiViet = "modal animated fadeOutRightBig";
    $scope.getTrangThaiModal = function () {
        if ($rootScope.classHienThiBaiViet == "modal animated fadeInRightBig"){
            $rootScope.classHienThiBaiViet = "modal animated fadeOutRightBig";
            $timeout(function () {
                $scope.dismiss();
                delete $scope.datapdu;
            }, 300);
        }
        else
            $rootScope.classHienThiBaiViet = "modal animated fadeInRightBig";
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
            "sizeFont": $rootScope.settingData[0].sizeFont,
            "nightMode": $rootScope.settingData[0].nightMode}]);
        if ($rootScope.settingData[0].nightMode == true) {
            $cordovaStatusbar.styleHex('#0A0A0A');
            $rootScope.cssModalHeaderSetting = "modal-header-setting     modal-header-setting-night";
            $rootScope.cssModeModalHeader = "modal-header             modal-header-night";
            $rootScope.cssModeModalCat = "modal-header-theloai     modal-header-theloai-night";
            $rootScope.cssModalContent = "xem_baiviet_bogoc_modal  xem_baiviet_bogoc_modal-night";
            $rootScope.cssModeHeader = "menu_header              menu_header-night";
            $rootScope.cssListThread = "list_baiviet             list_baiviet-night";
            $rootScope.cssModalCat = "modal-content-theloai    modal-content-theloai-night";
            $rootScope.cssModal = "modal-content            modal-content-night";
            $rootScope.cssMenuOther = "list_menu                list_menu-night";
            $rootScope.cssTitleList = "title_desk                title_desk-night";
            $rootScope.cssLinkMenu = "link_menu                link_menu-night";
            $rootScope.cssModeFooter            = "menu_footer              menu_footer-night";
            $rootScope.cssItemSelect            = "itemSelect              itemSelect-night";
        }else{
            $cordovaStatusbar.styleHex('#2dbe60');
            $rootScope.cssModalHeaderSetting    = "modal-header-setting";
            $rootScope.cssModeModalHeader       = "modal-header";
            $rootScope.cssModeModalCat          = "modal-header-theloai";
            $rootScope.cssModalContent          = "xem_baiviet_bogoc_modal";
            $rootScope.cssModeHeader            = "menu_header";
            $rootScope.cssListThread            = "list_baiviet";
            $rootScope.cssModalCat              = "modal-content-theloai";		
            $rootScope.cssModal                 = "modal-content"; 	
            $rootScope.cssMenuOther             = "list_menu"; 	
            $rootScope.cssTitleList             = "title_desk"; 
            $rootScope.cssLinkMenu              = "link_menu"; 
            $rootScope.cssModeFooter            = "menu_footer";
            $rootScope.cssItemSelect            = "itemSelect";	
        }
    };


    //Declare all of category
    $scope.theLoaiList =[{name: "Tất cả", id:"all"},{name: "Thông báo", id:"thongbao"},{name: "Tin tức", id:"tintuc"},{name: "Đào tạo", id:"daotao"},{name: "Hợp tác quốc tế", id:"hoptac"}];
    var theLoai = "all";               // Id for category default
    var pageIndex;  


    //Function handle get data from sever    
    $scope.getDataFromSever = function () {
        if ($scope.noMoreItemsAvailable == false) {
            pduService.Home_getPage(pageIndex, theLoai).success(function (data) {
                n = data.length, i = 0;
                if (n < 1)
                    $scope.noMoreItemsAvailable = true;
                for (; i < n; i++)
                    $scope.dataListHome.push(data[i]);
            });
            pageIndex++;
        }
    };

    $scope.onReload = function() {
      console.warn('reload');
      var deferred = $q.defer();
      setTimeout(function() {
        deferred.resolve(true);
      }, 1000);
      return deferred.promise;
    };

    //Get data from sever
    $scope.showData = function () {
        $scope.noMoreItemsAvailable = false;
        pageIndex = 1;
        $timeout(function(){
            $scope.getDataFromSever(); 
        }, 400);  
    };
    $scope.showData();


    //Process when frontend set new category value to filter data
    $scope.chonTheLoai = function (daChon) {
        $scope.dataListHome = [];
        theLoai = daChon.id;
        $scope.noMoreItemsAvailable = false;
        $scope.showData();
        delete daChon;
    };


    //Opening view modal and show thread
    $scope.showDataId = function (idBaiViet) {
        $rootScope.tapToExit = 0;
        $rootScope.openCaiDat = 0;
        $rootScope.openTheLoai = 0;
        $rootScope.openThread = 1; 
        $rootScope.viewImage = 0;
        $cordovaSpinnerDialog.show("","Đang tải", true);
        pduService.Home_getId(idBaiViet.Id).success(function (datapdus) {
            $scope.datapdu = datapdus;
            contentConvert = $scope.datapdu[0].Content;
            contentConvert = contentConvert.replace(/class='img-responsive'/g, " class='img-responsive' data-target='#slideHinhHome' data-toggle='modal' ");
            $scope.datapdu[0].Content = contentConvert;
            $cordovaSpinnerDialog.hide();
            delete datapdus; delete contentConvert;
        });
        $scope.getTrangThaiModal();
        delete idBaiViet;
    };


    //Share function
    $scope.shareTo = function () {
        $cordovaSocialSharing.share("Mời xem ...", $scope.datapdu[0].Title, null, "http://www.pdu.edu.vn/cntt/#article/" + $scope.datapdu[0].Id)
        .then(function (result) {
        }, function (err) {
        });
    };

    
    //Set img to zoom
    $scope.zoomThisImage = function (url, data) {
        $rootScope.viewImage = 1;
        $scope.urlImgageZoom = data[url].Url;
        delete url; delete data;
    };


    //Close view modal and destroy data
    $scope.huyData = function () {
        $rootScope.tapToExit = 1;
        $rootScope.openCaiDat = 0;
        $rootScope.openTheLoai = 0;
        $rootScope.openThread = 0; 
        $rootScope.viewImage = 0;
        $scope.getTrangThaiModal();
        angular.element('#caiDatKhiXem').modal('hide');
    };
    $scope.moTheLoai = function () {
        $rootScope.tapToExit = 0;
        $rootScope.openTheLoai = 1;
    };
    $scope.dongTheLoai = function () {
        $rootScope.tapToExit = 1;
        $rootScope.openTheLoai = 0;
    };
    $scope.moCaiDat = function () {
        $rootScope.openCaiDat = 1;
    };
    $scope.dongCaiDat = function () { 
        $rootScope.openCaiDat = 0;
    };
    $scope.dongImage = function () { 
        $rootScope.viewImage = 0;
    };

    
});