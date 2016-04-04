angular.module('pduNewsApp')
.controller('page_Contact_Ctrl', function ($scope) {


    $scope.listContact = [{
            name: " Lương Văn Nghĩa "
            , phone: "0913498804"
            , major: "cntt"
            , khoa: "Công nghệ thông tin"
        }
        , {
            name: " Võ Thị Ngoc Huệ "
            , phone: "0903073275"
            , major: "cntt"
            , khoa: "Công nghệ thông tin"
        }
        , {
            name: " Hà Văn Lâm "
            , phone: "0905444408"
            , major: "cntt"
            , khoa: "Công nghệ thông tin"
        }
        , {
            name: " Hà Văn Lâm "
            , phone: "0905967159"
            , major: "cntt"
            , khoa: "Công nghệ thông tin"
        }
        , {
            name: " Huỳnh Triệu Vỹ "
            , phone: "0914183435"
            , major: "xahoi"
            , khoa: "Xã hội"
        }
        , {
            name: " Võ Thị Thanh Bình "
            , phone: "0914202670"
            , major: "xahoi"
            , khoa: "Xã hội"
        }
        , {
            name: " Phạm Khánh Bảo "
            , phone: "0908100173"
            , major: "xahoi"
            , khoa: "Xã hội"
        }
        , {
            name: " Bùi Tá Duy "
            , phone: "0982042015"
            , major: "xahoi"
            , khoa: "Xã hội"
        }
        , {
            name: " Trần Đức Minh "
            , phone: "0948495015"
            , major: "coban"
            , khoa: "Cơ bản"
        }
        , {
            name: " Võ Thị Thiên Nga "
            , phone: "01682499020"
            , major: "coban"
            , khoa: "Cơ bản"
        }
        , {
            name: " Nguyễn Trí Nhân "
            , phone: "0979121318"
            , major: "coban"
            , khoa: "Cơ bản"
        }
        , {
            name: " Phạm Văn Tho "
            , phone: "0914163838"
            , major: "coban"
            , khoa: "Cơ bản"
        }
        , {
            name: " Nguyễn Thị Hoài Phương "
            , phone: "0905608005"
            , major: "cokhi"
            , khoa: "Cơ khí"
        }
        , {
            name: " Đặng Đình Thuận "
            , phone: "0919367857"
            , major: "cokhi"
            , khoa: "Cơ khí"
        }
        , {
            name: " Nguyễn Thị Trúc Quỳnh "
            , phone: "0973913090"
            , major: "cokhi"
            , khoa: "Cơ khí"
        }
        , {
            name: " Bùi Công Thành "
            , phone: "0977224055"
            , major: "cokhi"
            , khoa: "Cơ khí"
        }
        , {
            name: " Nguyễn Thị Thùy Trang "
            , phone: "0908053350"
            , major: "tunhien"
            , khoa: "Tự nhiên"
        }
        , {
            name: " Đinh Thị Xuân Vạn "
            , phone: "0905840369"
            , major: "tunhien"
            , khoa: "Tự nhiên"
        }
        , {
            name: " Phạm Văn Trung "
            , phone: "0986567740"
            , major: "tunhien"
            , khoa: "Tự nhiên"
        }
        , {
            name: " Phạm Khánh Gia "
            , phone: "0989679359"
            , major: "tunhien"
            , khoa: "Tự nhiên"
        }
                         ];
    $scope.theLoaiList = [{
            name: "Tất cả"
            , id: "all"
        }
        , {
            name: "Công nghệ thông tin"
            , id: "cntt"
        }
        , {
            name: "Xã hội"
            , id: "xahoi"
        }
        , {
            name: "Cở bản"
            , id: "coban"
        }
        , {
            name: "Cơ khí"
            , id: "cokhi"
        }
        , {
            name: "Tự nhiên"
            , id: "tunhien"
        }
                        ];

    $scope.searchMajor = ""; // Search by Major


    //Set new search by major value
    $scope.chonTheLoai = function (daChon) {
        $scope.searchMajor = daChon.id;
    };


});