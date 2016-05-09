angular.module('pduNewsApp')
.controller('main_Ctrl', function($scope, pduService, $rootScope, $timeout, localStorageService, $cordovaSQLite, $cordovaStatusbar, $cordovaLocalNotification, $cordovaDialogs, $interval, $cordovaInAppBrowser, $cordovaProgress, $cordovaToast) { 
    
    
    //Slider set brightness
    $rootScope.slider = {
        value: 0
        , options: {
            floor: 0
            , ceil: 100
            , step: 5
            , precision: 1
            , hidePointerLabels: true
            , hideLimitLabels: true
            , ticksTooltip: true
            , ticksValuesTooltip: true
            , onChange: function () {
                window.brightness = cordova.require("cordova.plugin.Brightness.Brightness");
                brightness.setBrightness($rootScope.slider.value / 100, win, fail);
                function win(status) {}
                function fail(status) {
                    $cordovaDialogs.alert(status, "Lỗi !!!");
                }
            }
        }
    }; 
        
    
    //Process event backbutton event
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton", function (e) {
            if($rootScope.fixedDoubleEventBackbutton >= 1){
                $rootScope.fixedDoubleEventBackbutton = 0;
            }
            else if($rootScope.fixedDoubleEventBackbutton == 0){
                if ($rootScope.tapToExit <= 2 && $rootScope.tapToExit >= 1) {
                    $rootScope.tapToExit++;
                    if ($rootScope.tapToExit == 3) {
                        navigator.app.exitApp();
                        $scope.$digest();
                    }
                    $cordovaToast.showShortCenter('Nhấn lại để thoát').then(function(success) {}, function (error) {});
                    $scope.$digest();
                } else if ($rootScope.viewImage == 1 && $rootScope.openCaiDat == 1 && $rootScope.openThread == 1) {
                    angular.element('#slideHinhHome').modal('hide');
                    angular.element('#slideHinhCntt').modal('hide');
                    angular.element('#slideHinhNews').modal('hide');
                    angular.element('#slideHinhSave').modal('hide');
                    $rootScope.viewImage = 0;
                    $scope.$digest();
                } else if ($rootScope.viewImage == 1 && $rootScope.openCaiDat == 0 && $rootScope.openThread == 1) {
                    angular.element('#slideHinhHome').modal('hide');
                    angular.element('#slideHinhCntt').modal('hide');
                    angular.element('#slideHinhNews').modal('hide');
                    angular.element('#slideHinhSave').modal('hide');
                    $rootScope.viewImage = 0;
                    $scope.$digest();
                } else if ($rootScope.viewImage == 0 && $rootScope.openCaiDat == 1 && $rootScope.openThread == 1) {
                    angular.element('#caiDatKhiXem').modal('hide');
                    angular.element('#caiDatKhiXemCntt').modal('hide');
                    angular.element('#caiDatKhiXemQldt').modal('hide');
                    angular.element('#caiDatKhiXemNews').modal('hide');
                    angular.element('#caiDatKhiXemSave').modal('hide');
                    angular.element('#huongDan').modal('hide');
                    angular.element('#dieuKhoan').modal('hide');
                    $rootScope.openCaiDat = 0;
                    $scope.$digest();
                } else if ($rootScope.viewImage == 0 && $rootScope.openCaiDat == 0 && $rootScope.openThread == 1) {
                    $rootScope.classHienThiBaiViet = "modal animated fadeOutRightBig";
                    $timeout(function () {
                        angular.element('#hienBaiHome').modal('hide');
                        angular.element('#hienBaiCntt').modal('hide');
                        angular.element('#hienBaiQldt').modal('hide');
                        angular.element('#hienBaiNews').modal('hide');
                        angular.element('#hienBaiSave').modal('hide');
                        angular.element('#hienInfoApp').modal('hide');
                    }, 500);
                    $rootScope.tapToExit = 1;
                    $rootScope.openThread = 0;
                    $scope.$digest();
                } else if ($rootScope.openTheLoai == 1) {
                    angular.element('#chonTheLoaiHome').modal('hide');
                    angular.element('#chonTheLoaiCntt').modal('hide');
                    angular.element('#chonTheLoaiQldt').modal('hide');
                    $rootScope.tapToExit = 1;
                    $rootScope.openTheLoai = 0;
                    $scope.$digest();
                } else if ($rootScope.viewStudieResult == 1) {
                    angular.element('#xemKetQuaHocTap').modal('hide');
                    $rootScope.tapToExit = 1;
                    $rootScope.viewStudieResult = 0;
                    $scope.$digest();
                } else if ($rootScope.viewRegisterHP == 1) {
                    angular.element('#dangKiHocPhan').modal('hide');
                    $rootScope.tapToExit = 1;
                    $rootScope.viewRegisterHP = 0;
                    $scope.$digest();
                }
                $rootScope.fixedDoubleEventBackbutton++; 
            }
        }, false);
    }

    
    //Open link from this view
    $scope.openWeb = function(url){
        $cordovaInAppBrowser.open(url, '_system');
    };
    
    
    //Load data setting when main loading
    $rootScope.settingData = localStorageService.get('settingData');
    if ( !$rootScope.settingData ) {
        $rootScope.settingData = [{"sizeFont": 1 ,"nightMode": false }];
    }
    if( $rootScope.settingData[0].nightMode == true){
        $rootScope.cssModalHeaderSetting    = "modal-header-setting     modal-header-setting-night"; 
        $rootScope.cssModeModalHeader       = "modal-header             modal-header-night"; 	
        $rootScope.cssModeModalCat          = "modal-header-theloai     modal-header-theloai-night";
        $rootScope.cssModalContent          = "xem_baiviet_bogoc_modal  xem_baiviet_bogoc_modal-night";
        $rootScope.cssFooterButton          = "status_buttons";  	
        $rootScope.cssModeHeader            = "menu_header              menu_header-night";
        $rootScope.cssListThread            = "list_baiviet             list_baiviet-night";
        $rootScope.cssModeFooter            = "menu_footer              menu_footer-night";
        $rootScope.cssModalCat              = "modal-content-theloai    modal-content-theloai-night"; 
        $rootScope.cssModal                 = "modal-content            modal-content-night";	 	
        $rootScope.cssTab                   = "slide                    night_Mode";	
        $rootScope.cssMenuOther             = "list_menu                list_menu-night";
        $rootScope.cssScrollInfo            = "scroller_info            scroller_info-night";
        $rootScope.cssLinkMenu              = "link_menu                link_menu-night"; 	
    }
    else{ 
        $rootScope.cssModalHeaderSetting    = "modal-header-setting"; 
        $rootScope.cssModeModalHeader       = "modal-header"; 
        $rootScope.cssModeModalCat          = "modal-header-theloai";
        $rootScope.cssModalContent          = "xem_baiviet_bogoc_modal";
        $rootScope.cssFooterButton          = "status_buttons";  	
        $rootScope.cssModeHeader            = "menu_header";
        $rootScope.cssListThread            = "list_baiviet";
        $rootScope.cssModeFooter            = "menu_footer";
        $rootScope.cssModalCat              = "modal-content-theloai"; 
        $rootScope.cssModal                 = "modal-content";	 	
        $rootScope.cssTab                   = "slide";  		
        $rootScope.cssMenuOther             = "list_menu";  	
        $rootScope.cssScrollInfo            = "scroller_info";
        $rootScope.cssLinkMenu              = "link_menu";   	
    }
    if( $rootScope.settingData[0].sizeFont == 1 )	
        $rootScope.cssFontSize              = "font1";	
    else if( $rootScope.settingData[0].sizeFont == 2 )	
        $rootScope.cssFontSize              = "font2";	
    else if( $rootScope.settingData[0].sizeFont == 3 )	
        $rootScope.cssFontSize              = "font3";	
    else	
        $rootScope.cssFontSize              ="font4";
 
    
    // Auto get notifican from sever every 5 seconds
	$rootScope.notificationSaved = localStorageService.get('notificationSaved'); 
	if ( !$rootScope.notificationSaved ) {
		$rootScope.notificationSaved = [{Session: 0}];
	}	
    $scope.autoRefresh = function() {
		$scope.soundPlay = false; 
			pduService.getNotification().success(function(dataSession) {
                $scope.notificationFromSever = angular.fromJson(dataSession[0]);
                $scope.calcSession = parseInt($scope.notificationFromSever.Id) + parseInt($scope.notificationFromSever.Session);
                if( $scope.notificationFromSever.Active == "active" ){
                    if( $rootScope.notificationSaved[0].Session != $scope.calcSession ){
                        $scope.soundPlay = true;
                        $rootScope.notificationSaved[0].Session = $scope.calcSession; 
                        localStorageService.set('notificationSaved',[{Session: $scope.calcSession}]);
                        $cordovaLocalNotification.schedule({
                            id: $rootScope.notificationSaved[0].Session,
                            title: $scope.notificationFromSever.Title,
                            text: $scope.notificationFromSever.Message
                        }).then(function (result) {
                        });
                        $cordovaDialogs.alert($scope.notificationFromSever.Message, $scope.notificationFromSever.Title); 
                    }
                }
                delete $scope.notificationFromSever; delete $scope.calcSession; delete $scope.soundPlay;
                delete dataSession;
			});  
    };
    $scope.autoRefresh();
    $scope.countDieInterval = 0;
    $scope.intervalPromise = $interval(function(){
        $scope.countDieInterval++;
        if($scope.countDieInterval == 10){
            $interval.cancel($scope.intervalPromise);
            $scope.intervalPromiseCon = $interval(function(){
                $scope.countDieInterval++;
                $scope.autoRefresh();
            }, 90000);
        }
        $scope.autoRefresh();
    }, 20000);
    
    
    //Set current index tab = idTad was saved
	$scope.currentIndex = 0;      
	//Set new current index tab & write to localstorage
	$scope.setCurrentIndex = function (index) {
		$scope.currentIndex = index; 
	};
	//Check current index tab
	$scope.isCurrentIndex = function (index) {
		return $scope.currentIndex === index;
	};
    
    
 	//Determine status modal view information application
	$rootScope.classHienThiBaiViet = "modal animated fadeOutRightBig"; 
	$scope.getTrangThaiModal = function(){
        $rootScope.tapToExit = 0;
        $rootScope.openCaiDat = 0;
        $rootScope.openTheLoai = 0;
        $rootScope.openThread = 1; 
        $rootScope.viewImage = 0;
		if ($rootScope.classHienThiBaiViet === "modal animated fadeInRightBig"){
			$rootScope.classHienThiBaiViet = "modal animated fadeOutRightBig";
            $timeout(function(){
                $scope.dismiss();
            }, 300);	
        }
		else
			$rootScope.classHienThiBaiViet = "modal animated fadeInRightBig";
	};
    
    
    //Đóng bài viết modal
    $scope.huyData = function() {
        $rootScope.tapToExit = 1;
        $rootScope.openCaiDat = 0;
        $rootScope.openTheLoai = 0;
        $rootScope.openThread = 0; 
        $rootScope.viewImage = 0;
		$scope.getTrangThaiModal();	
    };
    $scope.moHuongDan = function () {
        $rootScope.openCaiDat = 1;
    };
    $scope.dongHuongDan = function () { 
        $rootScope.openCaiDat = 0;
    }; 
    $scope.moDieuKhoan = function () {
        $rootScope.openCaiDat = 1;
    };
    $scope.dongDieuKhoan = function () { 
        $rootScope.openCaiDat = 0;
    }; 
    
    
	//Read thread saved in SQLite when click into page_Saved
	$scope.readListFromSQLite = function(){ 
		$rootScope.dataSave = [];  		
		$cordovaSQLite.execute($rootScope.db, "SELECT baiviet_id, baiviet_title, baiviet_date, baiviet_thumb, baiviet_img FROM sqlSave").then(function(res){
			for(var i = 0; i < res.rows.length; i++){
				$rootScope.dataSave.push(res.rows.item(i));
			}	
		}); 
	};	
});