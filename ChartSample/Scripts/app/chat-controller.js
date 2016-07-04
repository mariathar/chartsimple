ChatController.$inject = ['$location', '$anchorScroll', '$timeout', 'MessageHub', 'PrivateService'];

function ChatController($location, $anchorScroll, $timeout, MessageHub, PrivateService) {
    var vm = this;
    vm.name = "";
    vm.messages = [];
    vm.connect = connect;
    vm.message = '';
    vm.users = [];
    vm.sendPrivateMessage = sendPrivateMessage;
    vm.messagePrivate = "";
    vm.messagesPrivate = [];
    vm.userPrivate = '';
    vm.reloadPrivate = reloadPrivate;
    vm.connectedFail = '';
    vm.loadPrivatePanel = loadPrivatePanel;
    vm.sendMessage = sendMessage;

    ////
    function sendMessage() {
        MessageHub.invoke('sendMessage', vm.name, vm.message);
        vm.message = '';
    };

    function connect() {
        MessageHub.invoke('connect', vm.name);
    }

    function addMessage(message) {
        vm.messages.push(message);
        $location.hash('bottom-message');
        $anchorScroll();
    }

    function sendPrivateMessage() {
        PrivateService.Add(vm.name, vm.userPrivate, vm.messagePrivate);
        vm.messagesPrivate.push({ from: vm.name, txt: vm.messagePrivate });
        MessageHub.invoke('sendprivatemessage',vm.name, vm.userPrivate, vm.messagePrivate);
        vm.messagePrivate = '';
    }

    function reloadPrivate() {
        vm.userPrivate = '';
        vm.messagePrivate = '';
    }

    function loadPrivatePanel(user) {
        vm.userPrivate = user.name;
        user.dialog = false;
        vm.messagesPrivate = PrivateService.GetUser(user.name, vm.name);
    }

    MessageHub.on('addPrivateMessage', function (from, to, message) {
        vm.messagesPrivate.push({ from: from, txt: message });
        PrivateService.Add(from, to, message);
        for (var i in vm.users) {
            if (vm.users[i].name == from)
                vm.users[i].dialog = true;
        }
    });

    MessageHub.on('addMessage', function (user, message) {
        addMessage({ from: user, txt: message });
    });

    MessageHub.on('onconnected', function () {
        vm.login = !vm.login;
    });

    //получение списка всех пользователей онлайн
    MessageHub.on('sendUsers', function (users) {
        for(var i in users){
            vm.users.push({ name: users[i], dialog: false })
        }
    });

    //при подключении нового юзера
    MessageHub.on('onNewUserConnected', function (user) {
        vm.users.push({ name: user, dialog: false});
    });

    MessageHub.on('onConnectedFail', function () {
        vm.connectedFail = 'Введите другой логин!';
    });

    MessageHub.on('onUserDisconnected', function (name) {
        //удаление юзера из списка
        for (var i in vm.users) {
            if (name == vm.users[i].name)
                vm.users.splice(i, 1);
            if (vm.userPrivate == name)
                vm.userPrivate = '';
        }
        PrivateService.DeleteUser(vm.name, name);
    });
}