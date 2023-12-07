namespace Auth.Models
{
    public class LoginResultDto
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Token { get; set; }

        public DateTime ExpirationDate { get; set; }
    }
}
