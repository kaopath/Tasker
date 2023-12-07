using Task.Models;

namespace Task.Helpers
{
    public class Helpers
    {
        public static Func<Common.Models.Task, TaskDto> MapTo = task =>
        {
            return new TaskDto
            {
                TaskId = task.Id,
                UserId = task.UserId,
                Date = task.Date,
                Description = task.Description,
                EndTime = task.EndTime,
                StartTime = task.StartTime,
                Status = task.Status,
                Subject = task.Subject
            };
        };
    }
}
