angular.module('pduNewsApp', ['ui.router', 'LocalStorageModule', 'ngCordova', 'infinite-scroll', 'ngTouch', 'ngIOS9UIWebViewPatch'])
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: 'main.html',
            controller: 'main_Ctrl'  
        }) 
        .state('page_Home', {
            url: '/page_Home',
            templateUrl: 'page_Home.html',
            controller: 'page_Home_Ctrl'
        })
        .state('page_Qldt', {
            url: '/page_Qldt',
            templateUrl: 'page_Qldt.html',
            controller: 'page_Qldt_Ctrl'
        })
        .state('page_Saved', {
            url: '/page_Saved',
            templateUrl: 'page_Saved.html',
            controller: 'page_Saved_Ctrl'
        })
        .state('page_Contact', {
            url: '/page_Contact',
            templateUrl: 'page_Contact.html',
            controller: 'page_Contact_Ctrl'
        }) 
        .state('page_News', {
            url: '/page_News',
            templateUrl: 'page_News.html',
            controller: 'page_News_Ctrl'
        }) 
         ;
    $urlRouterProvider.otherwise('/main');
})
;