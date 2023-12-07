using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
namespace Task.Models
{
    public class TaskDto
    {
        [ValidateNever]
        public string TaskId { get; set; }
        public string UserId { get; set; }

        public DateTime Date { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string Subject { get; set; }

        public string Description { get; set; }

        public string Status { get; set; }
    }
}
