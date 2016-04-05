angular.module('pduNewsApp')
.controller('page_Qldt_Ctrl', function ($scope, pduService, $rootScope, $timeout, localStorageService, $cordovaSQLite, $cordovaFileTransfer, $cordovaFile, $cordovaSocialSharing, $cordovaStatusbar, $cordovaDialogs) {
    

    $scope.dataListQldt = []; //Contain data thread get from sever


    //Default to hide login box
    $scope.showLoginBox = false;
    $scope.titleLoginBox = "Thông tin đăng nhập";


    //Get list id thread saved
    $rootScope.listIDSaved = localStorageService.get('listIDSaved');
    if (!$rootScope.listIDSaved) {
        $rootScope.listIDSaved = [{
            Id: -1
        }];
    }
    //Get login infor
    $rootScope.saveLogin = localStorageService.get('saveLogin');
    if (!$rootScope.saveLogin) {
        $rootScope.saveLogin = [{
            user: ""
            , pass: ""
        }];
    }


    //Save thread to SQLite
    $scope.saveToSQLite = function (idBaiViet) {
        var imgThumb = "No";
        $scope.tempListId = $rootScope.listIDSaved;
        $scope.tempListId.push({
            Id: idBaiViet.Id + 'qldt'
        });
        localStorageService.set('listIDSaved', $scope.tempListId);
        $cordovaSQLite.execute($rootScope.db, "INSERT INTO sqlSave (baiviet_id, baiviet_title, baiviet_date, baiviet_author, baiviet_content, baiviet_img, baiviet_thumb) VALUES (?,?,?,?,?,?,?)", [$scope.datapdu[0].Id + 'qldt', $scope.datapdu[0].Title, $scope.datapdu[0].Date, $scope.datapdu[0].Author, $scope.datapdu[0].Content, " ", imgThumb]).then(function (res) {}, function (err) {
            console.error(err);
        });
    };


    //Delete thread from SQLite
    $scope.deleteToSQLite = function (idBaiViet) {
        $scope.tempListId = $rootScope.listIDSaved;
        var tongSoBai = $scope.tempListId.length;
        for (var i = 0; i < tongSoBai; i++) {
            if ($scope.tempListId[i].Id === idBaiViet.Id + 'qldt') {
                $scope.tempListId.splice(i, 1);
                localStorageService.set('listIDSaved', $scope.tempListId);
                break;
            }
        }
        $cordovaSQLite.execute($rootScope.db, "DELETE FROM sqlSave WHERE baiviet_id = ?", [idBaiViet.Id + 'qldt']).then(function (res) {});
    };


    //Check thread has saved on SQLite
    $scope.tonTai = false;
    $scope.checkTonTai = function (idBaiViet) {
        $scope.tempListId = $rootScope.listIDSaved;
        $scope.tonTai = false;
        var n = $scope.tempListId.length;
        for (var i = 0; i < n; i++) {
            if (idBaiViet.Id + 'qldt' === $scope.tempListId[i].Id) {
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
            "sizeFont":     $rootScope.settingData[0].sizeFont,
            "nightMode":    $rootScope.settingData[0].nightMode
        }]);
        if ($rootScope.settingData[0].nightMode == true) {
            $cordovaStatusbar.styleHex('#0A0A0A');
            $rootScope.cssModalHeaderSetting = "modal-header-setting     modal-header-setting-night";
            $rootScope.cssModeModalHeader = "modal-header             modal-header-night";
            $rootScope.cssListThreadQldt = "list_baiviet_qldt list_baiviet_qldt-night";
            $rootScope.cssModeModalCat = "modal-header-theloai     modal-header-theloai-night";
            $rootScope.cssModalContent = "xem_baiviet_bogoc_modal  xem_baiviet_bogoc_modal-night";
            $rootScope.cssModeHeader = "menu_header              menu_header-night";
            $rootScope.cssMenuOther = "list_menu                list_menu-night";
            $rootScope.cssModalCat = "modal-content-theloai    modal-content-theloai-night";
            $rootScope.cssModal = "modal-content            modal-content-night";
            $rootScope.cssloginBoxQldt = "loginbox_qldt            loginbox_qldt-night";
            $rootScope.cssdkHocPhan = "scroller_dkhocphan            scroller_dkhocphan-night";
            $rootScope.cssModeFooter            = "menu_footer              menu_footer-night";
            $rootScope.cssItemSelect            = "itemSelect              itemSelect-night";
        } else {
            $cordovaStatusbar.styleHex('#2dbe60');
            $rootScope.cssModalHeaderSetting = "modal-header-setting";
            $rootScope.cssModeModalHeader = "modal-header";
            $rootScope.cssListThreadQldt = "list_baiviet_qldt";
            $rootScope.cssModeModalCat = "modal-header-theloai";
            $rootScope.cssModalContent = "xem_baiviet_bogoc_modal";
            $rootScope.cssModeHeader = "menu_header";
            $rootScope.cssMenuOther = "list_menu";
            $rootScope.cssModalCat = "modal-content-theloai";
            $rootScope.cssModal = "modal-content";
            $rootScope.cssloginBoxQldt = "loginbox_qldt";
            $rootScope.cssdkHocPhan = "scroller_dkhocphan";
            $rootScope.cssModeFooter            = "menu_footer";
            $rootScope.cssItemSelect            = "itemSelect";
        }
    };


    //Process login and get info student
    $scope.hpDaKi = [];
    var daDangnhap = "chua"; //Default user not login
    $scope.inforLogin = {}; //Contain json info of student when login success
    //Check login to sever
    $scope.Ktra = function () {
            pduService.Qldt_postLogin({
                user: $scope.inforLogin.taiKhoan
                , pass: $scope.inforLogin.matKhau
            }).success(function (data) {
                if (data[0].Login === "Yes") {
                    daDangnhap = "true";
                    $scope.loginRec = data;
                    localStorageService.set('saveLogin', [{
                        "user": $scope.inforLogin.taiKhoan
                        , "pass": $scope.inforLogin.matKhau
                    }]);
                    $scope.titleLoginBox = "Thông tin sinh viên";
                    $scope.hpDaKi = [];
                    pduService.Qldt_selectHocPhan({
                        user: $rootScope.saveLogin[0].user,
                        pass: $rootScope.saveLogin[0].pass
                    }).success(function (data) {
                        $scope.hpDaKi.push(data[0]); 
                    });
                } else {
                    localStorageService.set('saveLogin', [{
                        "user": ""
                        , "pass": ""
                    }]);
                    $cordovaDialogs.alert("Thông tin đăng nhập không chính xác", "Lỗi");
                }
            });
        }
        //Auto login if has login success ago
    $scope.autoLogin = function () {
        if ($rootScope.saveLogin[0].user != "") {
            pduService.Qldt_postLogin({
                user: $rootScope.saveLogin[0].user
                , pass: $rootScope.saveLogin[0].pass
            }).success(function (data) {
                if (data[0].Login === "Yes") {
                    daDangnhap = "true";
                    $scope.loginRec = data;
                    $scope.titleLoginBox = "Thông tin sinh viên";
                    $scope.hpDaKi = [];
                    pduService.Qldt_selectHocPhan({
                        user: $rootScope.saveLogin[0].user,
                        pass: $rootScope.saveLogin[0].pass
                    }).success(function (data) {
                        $scope.hpDaKi.push(data[0]); 
                    });
                }
            });
        }
    };
    $scope.autoLogin();
    //Determine status of login process
    $scope.travedaDangnhap = function () {
        return daDangnhap == "true";
    };
    //Set status logout
    $scope.dangXuat = function () {
        daDangnhap = "chua";
    };
    //Process logout
    $scope.dangXuat = function () {
        daDangnhap = "chua";
        localStorageService.set('saveLogin', [{
            "user": ""
            , "pass": ""
        }]);
        $scope.titleLoginBox = "Thông tin đăng nhập";
    };


    //Declare all of category
    $scope.danhSachHocPhan = [{ "name": "Những nguyên lí cơ bản của chủ nghĩa Mác-Lênin 1",
                                "id": "nl1",
                                "lophoc":[    {"id":"cn1",
                                            "name":"Lớp CN 1"},
                                            {"id":"cn2",
                                            "name":"Lớp CN 2"},
                                            {"id":"cn3",
                                            "name":"Lớp CN 3"}]
                              }];
    
    
    //Đăng kí học phần 
    $scope.dkHocPhan = function (lop) { 
        $scope.hpDaKi = []; 
        pduService.Qldt_insertHocPhan({
            user: $rootScope.saveLogin[0].user,
            pass: $rootScope.saveLogin[0].pass,
            content: '[{"name":"'+$scope.danhSachHocPhan[0].name+'", "id":"'+$scope.danhSachHocPhan[0].id+'", "lophoc":[{"id":"'+lop.id+'","name":"'+lop.name+'"}]}]'
        }).success(function (data) {
            if(data[0].Update == "Yes"){
                pduService.Qldt_selectHocPhan({
                    user: $rootScope.saveLogin[0].user,
                    pass: $rootScope.saveLogin[0].pass
                }).success(function (data) {
                    $scope.hpDaKi.push(data[0]); 
                });
                $cordovaDialogs.alert("Đăng kí thành công", "Hoàn thành");
            }
            else 
                $cordovaDialogs.alert("Thông tin không chính xác", "Lỗi");
        });
    };


    //Declare all of category
    $scope.theLoaiList = [  {name: "Tất cả", id: "all"},
                            {name: "Thông báo", id: "thongbao"},
                            {name:"Tin tức", id: "tintuc"}];
    var theLoai = "all"; // Id for category default
    var pageIndex; // Current page index of list thread 


    //Function handle get data from sever 
    $scope.getDataFromSever = function () {
        //$scope.noMoreItemsAvailable = false;
        if ($scope.noMoreItemsAvailable == false) {
            pduService.Qldt_getPage(pageIndex, theLoai).success(function (data) {
                var n = data.length
                    , i = 0;
                if (n < 1)
                    $scope.noMoreItemsAvailable = true;
                for (; i < n; i++)
                    $scope.dataListQldt.push(data[i]);
            });
            pageIndex++;
        }
    };

    
    //
    $scope.showData = function () {
        $scope.noMoreItemsAvailable = false;
        pageIndex = 1; 
        $timeout(function(){
            $scope.getDataFromSever(); 
        }, 300); 
    };
    $scope.showData();


    //Process when frontend set new category value to filter data
    $scope.chonTheLoai = function (daChon) {
        $scope.dataListQldt = [];
        theLoai = daChon.id;
        $scope.noMoreItemsAvailable = false;
        $scope.showData();
    };


    //Opening view modal and show thread
    $scope.showDataId = function (idBaiViet) {
        pduService.Qldt_getId(idBaiViet.Id).success(function (datapdus) {
            $scope.datapdu = datapdus;
        });
        $scope.getTrangThaiModal();
    };


    //Share function
    $scope.shareTo = function () {
        $cordovaSocialSharing.share("Mời xem ...", $scope.datapdu[0].Title, null, "http://www.pdu.edu.vn/cntt/#article/" + $scope.datapdu[0].Id) // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured
            });
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