angular.module('pduNewsApp')
.controller('page_Saved_Ctrl', function ($scope, pduService, $rootScope, $timeout, localStorageService, $cordovaSQLite, $cordovaFile, $cordovaSocialSharing, $cordovaStatusbar) {


    //Get list id thread saved
    $rootScope.listIDSaved = localStorageService.get('listIDSaved');
    if (!$rootScope.listIDSaved) {
        $rootScope.listIDSaved = [{
            Id: -1
        }];
    }


    //Show or hide button delete thread
    $scope.deleteButton = false;
    $scope.showDeleteButton = function () {
        $scope.deleteButton = !$scope.deleteButton;
        return $scope.deleteButton;
    }


    //Contain data for binding when view thread
    $scope.datapdu = [];


    $scope.classHienThiBaiViet = "modal animated fadeOutRightBig";


    //Determine status modal view thread
    $scope.getTrangThaiModal = function () {
        if ($scope.classHienThiBaiViet == "modal animated fadeInRightBig")
            $scope.classHienThiBaiViet = "modal animated fadeOutRightBig";
        else
            $scope.classHienThiBaiViet = "modal animated fadeInRightBig";
    }


    //Set new font size
    $scope.setCurrentsizeFont = function (index) {
        $rootScope.settingData[0].sizeFont = index;
    };


    //Check current font size and binding
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


    //Switch between night and day mode view
    $scope.Switch = function () {
        localStorageService.set('settingData', [{
            "sizeFont": $rootScope.settingData[0].sizeFont
            , "nightMode": $rootScope.settingData[0].nightMode
        }]);
        if ($rootScope.settingData[0].nightMode == true) {
            $cordovaStatusbar.style(1);
            $rootScope.cssModalHeaderSetting = "modal-header-setting     modal-header-setting-night";
            $rootScope.cssModeModalHeader = "modal-header             modal-header-night";
            $rootScope.cssModeModalCat = "modal-header-theloai     modal-header-theloai-night";
            $rootScope.cssModalContent = "xem_baiviet_bogoc_modal  xem_baiviet_bogoc_modal-night";
            $rootScope.cssFooterButton = "status_buttons";
            $rootScope.cssModeHeader = "menu_header              menu_header-night";
            $rootScope.cssListThread = "list_baiviet             list_baiviet-night";
            $rootScope.cssModeFooter = "menu_footer              menu_footer-night";
            $rootScope.cssModalCat = "modal-content-theloai    modal-content-theloai-night";
            $rootScope.cssModal = "modal-content            modal-content-night";
            $rootScope.cssTab = "slide                    night_Mode";
            $rootScope.cssMenuOther = "list_menu                list_menu-night";
            $rootScope.cssListThreadQldt = "list_baiviet_qldt list_baiviet-night";
            $rootScope.cssScrollInfo = "scroller_info            scroller_info-night";
        } else {
            $cordovaStatusbar.style(0);
            $rootScope.cssModalHeaderSetting = "modal-header-setting";
            $rootScope.cssModeModalHeader = "modal-header";
            $rootScope.cssModeModalCat = "modal-header-theloai";
            $rootScope.cssModalContent = "xem_baiviet_bogoc_modal";
            $rootScope.cssFooterButton = "status_buttons";
            $rootScope.cssModeHeader = "menu_header";
            $rootScope.cssListThread = "list_baiviet";
            $rootScope.cssModeFooter = "menu_footer";
            $rootScope.cssModalCat = "modal-content-theloai";
            $rootScope.cssModal = "modal-content";
            $rootScope.cssTab = "slide";
            $rootScope.cssMenuOther = "list_menu";
            $rootScope.cssListThreadQldt = "list_baiviet_qldt";
            $rootScope.cssScrollInfo = "scroller_info";
        }
    };


    //View a thread 
    $scope.showById = function (idBaiViet) {
        $scope.getTrangThaiModal();
        $cordovaSQLite.execute($rootScope.db, "SELECT * FROM sqlSave WHERE baiviet_id = ?", [idBaiViet.baiviet_id]).then(function (res) {
            $scope.datapdu.push(res.rows.item(0));
        });
    };


    //Share function
    $scope.shareTo = function () {
        $cordovaSocialSharing.share("Mời xem ..." + $scope.datapdu[0].baiviet_title, $scope.datapdu[0].baiviet_title, null, "http://www.pdu.edu.vn/cntt/#article/" + $scope.datapdu[0].baiviet_id) // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured.
            });
    };


    //Set img to zoom
    $scope.zoomThisImage = function (url, data) {
        var json = JSON.parse(data);
        PhotoViewer.show(json[url].Url, $scope.datapdu[0].baiviet_title); 
    };


    //Close modal view thread
    $scope.huyData = function () {
        $scope.getTrangThaiModal();
        $timeout(function () {
            $scope.dismiss();
            $scope.datapdu = [];
        }, 300);
    };


    //Delete thread from SQLite
    $scope.deleteToSQLite = function (idBaiViet) {
        var str = idBaiViet.baiviet_id;
        var lenStr = str.length;
        //If thread has image, delete it
        if (str[lenStr - 4] == 'h' && str[lenStr - 3] == 'o' && str[lenStr - 2] == 'm' && str[lenStr - 1] == 'e') {
            $scope.listImgSaved = JSON.parse(idBaiViet.baiviet_img);
            var numFor = $scope.listImgSaved.length;
            for (var i = 0; i < numFor; i++) {
                var url = $scope.listImgSaved[i].Url;
                var filename = url.split("/").pop();
                $cordovaFile.removeFile(cordova.file.dataDirectory, filename)
                    .then(function (success) {}, function (error) {});
            }
        }
        //Delete it from frontend was binding
        var tongSoBai = $rootScope.dataSave.length;
        for (var i = 0; i < tongSoBai; i++) {
            if ($rootScope.dataSave[i].baiviet_id === idBaiViet.baiviet_id) {
                $rootScope.dataSave.splice(i, 1);
                break;
            }
        }
        //Remove it from list id thread saved
        tongSoBai = $rootScope.listIDSaved.length;
        for (var i = 0; i < tongSoBai; i++) {
            if ($rootScope.listIDSaved[i].Id == idBaiViet.baiviet_id) {
                $rootScope.listIDSaved.splice(i, 1);
                localStorageService.set('listIDSaved', $rootScope.listIDSaved);
                break;
            }
        }
        //Delete from SQLite
        $cordovaSQLite.execute($rootScope.db, "DELETE FROM sqlSave WHERE baiviet_id = ?", [idBaiViet.baiviet_id]).then(function (res) {});
        //If modal view thread is opening, close it and destroy data
        if ($scope.classHienThiBaiViet == "modal animated fadeInRightBig")
            $scope.huyData();
    };


});