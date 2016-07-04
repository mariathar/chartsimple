MessageHub.$inject = ['HubProxy'];

function MessageHub(Hub) {
    var messageHub = new Hub('messageHub', { connectionPath: '/signalr', loggingEnabled: true });
    messageHub.start();
    return messageHub;
}
