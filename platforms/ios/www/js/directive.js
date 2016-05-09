angular.module('pduNewsApp')


//Handle fast tap
.directive("ngTap", function() {
  return function($scope, $element, $attributes) {
    var tapped;
    tapped = false;
    $element.bind("click", function() {
      if (!tapped) { 
        return $scope.$apply($attributes["ngTap"]);
      }
    });
    $element.bind("touchstart", function(event) { 
      return tapped = true;
    });
    $element.bind("touchmove", function(event) {
      tapped = false;
      return event.stopImmediatePropagation();
    });
    return $element.bind("touchend", function() {
      if (tapped) {
        return $scope.$apply($attributes["ngTap"]);
      }
    });
  };
})


//Close modal view thread
.directive('closeMyModal', function () {
    return {
        restrict: 'A'
        , link: function (scope, element, attr) {
            scope.dismiss = function () {
                element.modal('hide');
            };
        }
    }
})


//Set IMG to background div
.directive('backImg', function () {
    return function (scope, element, attrs) {
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url + ')'
            , 'background-size': 'cover'
            , 'background-repeat': 'no-repeat'
            , 'background-position': 'center center'
        });
    };
})


//Allow rendering HTML content
.directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                return scope.$eval(attrs.compile);
            }
            , function (value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        )
    };
}])
;