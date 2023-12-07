using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Middlewares
{
    public static class CustomMiddlewares
    {
        public static IServiceCollection AddCustomSwagger(this IServiceCollection services, OpenApiInfo apiInfo)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", apiInfo ?? new OpenApiInfo
                {
                    Title = "Tasker Api",
                    Version = "v1",
                });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                    {
                        new OpenApiSecurityScheme{ Reference = new OpenApiReference
                                                    {
                                                        Type = ReferenceType.SecurityScheme,
                                                        Id = "Bearer",
                                                    },
                        },
                        new string[] { }
                    },
                    });
            });
            return services;
        }

        public static IServiceCollection AddStoreContext(this IServiceCollection services)
        {
            return services.AddDbContext<StoreContext>();
        }

        public static IServiceCollection AddCustomAuth(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddAuthentication(options =>
 {
     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
 }).AddJwtBearer(options =>
                     {
                         options.TokenValidationParameters = new TokenValidationParameters
                         {
                             ValidateIssuer = false,
                             ValidateAudience = false,
                             ValidateLifetime = true,
                             ValidateIssuerSigningKey = false,
                             ValidIssuer = configuration["Issuer"],
                             ValidAudience = configuration["Audience"],
                             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["SecretKey"])),
                         };
                     });

            return services;
        }
        public static IServiceCollection AddCustomCors(this IServiceCollection services, string policyName)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: policyName, builder =>
                {
                    builder.WithOrigins("http://localhost:5173", "https://localhost:5173", "http://localhost:5174", "https://localhost:5174")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });
            return services;
        }

    }
}
