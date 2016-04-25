angular.module('pduNewsApp')
.factory('pduService', function($http) {
    var baseUrl = 'http://acm.svpdu.net/';
    return {
        
        //Get notification from server
        getNotification: function (){
            return $http.get('http://demo-kakalot.rhcloud.com/getNotification.php'); 
        },
        
        
        //Process for Home
        Home_getPage: function (pageId, theLoai){
            return $http.get(baseUrl+'Home_select_page.php?page='+pageId+'&theloai='+theLoai); 
        },
        Home_getId: function (Id){
            return $http.get(baseUrl+'Home_select_id.php?id='+Id); 
        },
        
        
        //Process for Cntt
        Cntt_getPage: function (pageId, theLoai){
            return $http.get(baseUrl+'Cntt_select_page.php?page='+pageId+'&theloai='+theLoai); 
        },
        Cntt_getId: function (Id){
            return $http.get(baseUrl+'Cntt_select_id.php?id='+Id); 
        },
        
        
        //Process for News
        News_getPage: function (){
            return $http.get(baseUrl+'News_select_page.php'); 
        },
        News_getId: function (Id){
            return $http.get(baseUrl+'News_select_id.php?id='+Id); 
        },
          
        
        //Process for Qltt
//        Qltt_postLogin: function (inforLogin){
//            return $http.post(baseUrl+'Qltt_login.php',inforLogin,{
//                headers: {
//                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
//                }
//            });
//        },
//        Qltt_insert: function (inforInsert){
//            return $http.post(baseUrl+'Qltt_insert.php',inforInsert,{
//                headers: {
//                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
//                }
//            });
//        },
//        Qltt_delete: function (inforDelete){
//            return $http.post(baseUrl+'Qltt_delete.php',inforDelete,{
//                headers: {
//                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
//                }
//            });
//        },
//        Qltt_update: function (inforUpdate){
//            return $http.post(baseUrl+'Qltt_update.php',inforUpdate,{
//                headers: {
//                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
//                }
//            });
//        },
        
        
        //Process for Qldt
        Qldt_postLogin: function (inforLogin){
            return $http.post(baseUrl+'Qldt_login.php',inforLogin,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        Qldt_getPage: function (pageId, theLoai){
            return $http.get(baseUrl+'Qldt_select_page.php?page='+pageId+'&theloai='+theLoai); 
        },
        Qldt_getId: function (Id){
            return $http.get(baseUrl+'Qldt_select_id.php?id='+Id); 
        },
        Qldt_getId_Sinhvien: function (Id){
            return $http.get(baseUrl+'Qldt_select_id_sinhvien.php?id='+Id); 
        },
        Qldt_getHoctap: function (IDSvien){
            return $http.get(baseUrl+'Qldt_select_id_hoctap.php?idsv='+IDSvien); 
        },
        //Process for Qltt register
        Qldt_insertHocPhan: function (inforInsert){
            return $http.post(baseUrl+'Qltt_insertHocPhan.php',inforInsert,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        Qldt_selectHocPhan: function (inforSelect){
            return $http.post(baseUrl+'Qltt_selectHocPhan.php',inforSelect,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
        
    };
    
});