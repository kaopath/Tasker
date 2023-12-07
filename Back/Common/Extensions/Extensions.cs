using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Common.Extensions
{
    public static class Extensions
    {
        public static string GetUserId(this HttpContext httpContext)
        {
            return httpContext?
                .User?
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
