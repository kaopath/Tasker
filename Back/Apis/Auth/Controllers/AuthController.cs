using Auth.Models;
using Common.Filters;
using Common.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Auth.Extensions;

namespace Auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;
        private IConfiguration _config;
        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }
      
        [HttpGet("{id}")]
        public async Task<UserDto> Get(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            return new UserDto
            {
                Email = user.Email,
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }

        [HttpGet()]
        public async Task<List<UserDto>> GetUsers()
        {
            return _userManager.Users.Select(s => new UserDto
            {
                Email = s.Email,
                UserId = s.Id,
                FirstName = s.FirstName,
                LastName = s.LastName
            }).ToList();

        }

        [HttpPost]
        [Route("Register")]
        [ModelStateValidationFilter]
        public async Task<bool> Register([FromBody] UserRegisterDto userDto)
        {
            var user = new User()
            {
                Email = userDto.Email,
                UserName = userDto.Email,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName
            };

            var identityResult = await _userManager.CreateAsync(user);

            if (!identityResult.Succeeded)
            {
                throw new Exception("Registration is not successfull!");
            }

            var passwordResult = await _userManager.AddPasswordAsync(user, userDto.Password);

            return passwordResult.Succeeded;
        }

        [HttpPost]
        [Route("Login")]
        [ModelStateValidationFilter]
        public async Task<LoginResultDto> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Email);
            if (user == null)
            {
                throw new ArgumentException("User not exists.");
            }

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!signInResult.Succeeded)
            {
                throw new Exception("Wrong email or password.");
            }

            return new LoginResultDto
            {
                Email = loginDto.Email,
                Token = user.Token(_config),
                FirstName = user.FirstName,
                LastName = user.LastName,
                ExpirationDate = DateTime.UtcNow.AddHours(12)
            };
        }
    }
}
