//(function (angular) {
    angular.module('app', ['services.hub']);
    angular.module('app').factory('MessageHub', MessageHub);
    angular.module('app').factory('PrivateService', PrivateService);
    angular.module('app').controller("ChatController", ChatController);

//})(window.angular);