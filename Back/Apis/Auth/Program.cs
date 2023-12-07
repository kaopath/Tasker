using Common;
using Common.Consts;
using Common.Middlewares;
using Common.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddStoreContext();
builder.Services.AddCustomSwagger(new Microsoft.OpenApi.Models.OpenApiInfo() { });
builder.Services.AddCustomCors(CommonConsts.API_CORS_POLICY_DEVELOPMENT);
builder.Services.AddIdentityCore<User>(op =>
{
    op.Password.RequireDigit = false;
    op.Password.RequireLowercase = false;
    op.Password.RequiredLength = 3;
    op.Password.RequiredUniqueChars = 0;
    op.Password.RequireNonAlphanumeric = false;
    op.Password.RequireUppercase = false;
    op.User.RequireUniqueEmail = false;
})
    .AddEntityFrameworkStores<StoreContext>();


builder.Services.AddHttpContextAccessor();

builder.Services.TryAddScoped<UserManager<User>>();
builder.Services.TryAddScoped<SignInManager<User>>();
var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();
if (app.Environment.IsDevelopment())
{
    app.UseCors(CommonConsts.API_CORS_POLICY_DEVELOPMENT);
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseAuthorization();

app.MapControllers();

app.Run();
