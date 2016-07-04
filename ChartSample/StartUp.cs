using System;
using Owin;
using Microsoft.Owin;

[assembly: OwinStartup(typeof(ChartSample.Startup))]
namespace ChartSample
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
