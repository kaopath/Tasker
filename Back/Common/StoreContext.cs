using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class StoreContext : IdentityDbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userId;
        public StoreContext(DbContextOptions<StoreContext> dbcontextoption, IHttpContextAccessor httpContextAccessor) : base(dbcontextoption)
        {
            ChangeTracker.AutoDetectChangesEnabled = false;
            this._httpContextAccessor = httpContextAccessor;
            _userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseInMemoryDatabase(databaseName: "TaskDb");
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Common.Models.Task>();//.HasQueryFilter(p => p.UserId == _userId);
            base.OnModelCreating(builder);
        }
        public DbSet<Models.Task> Tasks { get; set; }
        public DbSet<Models.User> Users { get; set; }
    }
}
