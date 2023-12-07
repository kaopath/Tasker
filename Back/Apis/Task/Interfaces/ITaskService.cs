using Task.Models;

namespace Task.Interfaces
{
    public interface ITaskService
    {
        Task<TaskDto> AddTask(Common.Models.Task task);
        Task<TaskDto> UpdateTask(string id, Common.Models.Task task);
        void DeleteTask(string id);
        Task<TaskDto> GetTask(string id);
        Task<IEnumerable<TaskDto>> GetTasks();
    }
}
