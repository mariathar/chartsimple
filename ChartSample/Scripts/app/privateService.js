function PrivateService() {
    var PrivateLocal = new Array();
    var factory = {};

    factory.Add = function Add(from, to, message) {
        PrivateLocal.push({ from: from, to: to, txt: message });
    }

    factory.GetUser = function GetUser(user, from) {
        var result = new Array();
        for (var i in PrivateLocal) {
            if ((PrivateLocal[i].from == user && PrivateLocal[i].to == from) ||
                (PrivateLocal[i].from == from && PrivateLocal[i].to == user))
                result.push(PrivateLocal[i]);
        }
        return result;
    }

    factory.DeleteUser = function DeleteUser(user, from) {
        var result = new Array();
        for (var i in PrivateLocal) {
            if ((PrivateLocal[i].from == user && PrivateLocal[i].to == from) ||
                (PrivateLocal[i].from == from && PrivateLocal[i].to == user))
                result.splice(i, 1);
        }
        PrivateLocal = result;
        console.log(PrivateLocal);
    }
    return factory;
}
