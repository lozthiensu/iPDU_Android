angular.module('pduNewsApp')
.controller('main_Ctrl', function($scope, pduService, $rootScope, $timeout, localStorageService, $cordovaSQLite, $cordovaStatusbar, $cordovaLocalNotification, $cordovaDialogs, $interval, $cordovaInAppBrowser, $cordovaProgress) { 
    
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton", function (e) {
            $rootScope.$emit("closeOk", {});
            $scope.$digest();

//            //$rootScope.$apply(function () {
//            if ($rootScope.tapToExit == 3) {
//                navigator.app.exitApp();
//                $scope.$digest();
//                e.preventDefault();
//                e.stopPropagation();
//            } else if ($rootScope.tapToExit<=2&&$rootScope.tapToExit>=1) {
//                $rootScope.tapToExit++;
//                $scope.$digest();
//                e.preventDefault();
//                e.stopPropagation();
//            } else if ($rootScope.viewImage==1&&$rootScope.openCaiDat==1&&$rootScope.openThread==1) {
//                $('#slideHinhHome').modal('hide');
////                $rootScope.viewImage = 0;
//                $scope.$digest();
//                e.preventDefault();
//                e.stopPropagation();
//            } else if ($rootScope.viewImage==1&&$rootScope.openCaiDat==0&&$rootScope.openThread==1) {
//                $('#slideHinhHome').modal('hide');
////                $rootScope.viewImage = 0;
//                $scope.$digest();
//                e.preventDefault();
//                e.stopPropagation();
//            } else if ($rootScope.viewImage==0&&$rootScope.openCaiDat==1&&$rootScope.openThread==1) {
//                $('#caiDatKhiXem').modal('hide');
////                $rootScope.openCaiDat = 0;
//                $scope.$digest();
//                e.preventDefault();
//                e.stopPropagation();
//            } else if ($rootScope.viewImage==0&&$rootScope.openCaiDat==0&&$rootScope.openThread==1) {
//                $rootScope.classHienThiBaiViet = "modal animated fadeOutRightBig";
//                $timeout(function () {
//                    $('#hienBaiHome').modal('hide');
//                }, 1000);
////                $rootScope.tapToExit = 1;
////                $rootScope.openCaiDat = 0;
////                $rootScope.openTheLoai = 0;
////                $rootScope.openThread = 0;
////                $rootScope.viewImage = 0;
//                $scope.$digest();
//                e.preventDefault();
//                e.stopPropagation();
//            }
//            if ($rootScope.openTheLoai == 1) {
//                $('#chonTheLoaiHome').modal('hide');
////                $rootScope.tapToExit = 1;
////                $rootScope.openTheLoai = 0;
//                $scope.$digest();
//                e.preventDefault();
//                e.stopPropagation();
//            }
            //});
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
		$scope.getTrangThaiModal();	
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