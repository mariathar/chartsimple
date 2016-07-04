using System;
using System.Linq;
using Microsoft.AspNet.SignalR;
using System.Collections.Generic;

namespace ChartSample.Hubs
{

    public class User
    {
        public string ConnectionId { get; set; }
        public string Name { get; set; }
    }

    public class MessageHub : Hub
    {
        static List<User> Users = new List<User>();

        public void SendMessage (string name, string message)
        {
            Clients.All.addMessage(name, message);
        }

        public void SendPrivateMessage(string from, string to, string message)
        {
            var id = Users.Where(x => x.Name == to).SingleOrDefault().ConnectionId;
            Clients.Client(id).addPrivateMessage(from, to, message);
        }
        public void SendUser(string name)
        {
            Clients.AllExcept(Context.ConnectionId).sendUser(name);
        }

        // Подключение нового пользователя
        public void Connect(string userName)
        {
            var id = Context.ConnectionId;

            if (!Users.Any(x => x.ConnectionId == id) && !Users.Any(x => x.Name == userName))
            {
                Users.Add(new User { ConnectionId = id, Name = userName });
                Clients.Caller.onConnected(id, userName, Users);
                Clients.Caller.sendUsers(Users.Where(x => x.ConnectionId != Context.ConnectionId)
                       .Select(x => x.Name).ToList());
                Clients.AllExcept(id).onNewUserConnected(userName);
                return;
            }
            Clients.Caller.onConnectedFail();
        }

        // Отключение пользователя
        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            var item = Users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                Users.Remove(item);
                var id = Context.ConnectionId;
                //Clients.All.onUserDisconnected(id, item.Name);
                Clients.All.onUserDisconnected(item.Name);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}
