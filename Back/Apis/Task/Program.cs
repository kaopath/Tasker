using Common.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Task.Interfaces;
using Task.Services;
using Common.Consts;
using Task.Consts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddCustomSwagger(new OpenApiInfo { Title = "Task Api", Version = "v1" });
builder.Services.AddCustomCors(CommonConsts.API_CORS_POLICY_DEVELOPMENT);
builder.Services.AddStoreContext();
builder.Services.Configure<ApiBehaviorOptions>(options => options.SuppressModelStateInvalidFilter = true);
builder.Services.AddHttpContextAccessor();
builder.Services.AddCustomAuth(builder.Configuration);
builder.Services.AddMemoryCache(opt => opt.ExpirationScanFrequency = new TimeSpan(10 * 1000));

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
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
