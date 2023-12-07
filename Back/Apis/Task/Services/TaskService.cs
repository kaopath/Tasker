using Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Task.Interfaces;
using Task.Models;

namespace Task.Services
{
    public class TaskService : ITaskService
    {
        private StoreContext _storeContext;
        public TaskService(StoreContext storeContext)
        {
            _storeContext = storeContext;
        }
        public async Task<TaskDto> AddTask(Common.Models.Task task)
        {
            await _storeContext.Tasks.AddAsync(task);
            _storeContext.SaveChanges();

            return Helpers.Helpers.MapTo(task);
        }

        public async Task<TaskDto> UpdateTask(string id, Common.Models.Task task)
        {
            var taskOld = await _storeContext.Tasks.FindAsync(id);

            if (taskOld == null)
            {
                throw new ArgumentException("task is not found");
            }
           
            taskOld.Subject = task.Subject;
            taskOld.Status = task.Status;
            taskOld.StartTime = task.StartTime;
            taskOld.EndTime = task.EndTime;
            taskOld.UpdatedAt = task.UpdatedAt;
            taskOld.Description = task.Description;
            taskOld.Date = task.Date;   

            _storeContext.Update(taskOld);
            _storeContext.SaveChanges();

            return Helpers.Helpers.MapTo(task);
        }
        public async Task<TaskDto> GetTask(string id)
        {
            return await _storeContext.Tasks
                .Where(d => d.Id == id)
                .Select(s => Helpers.Helpers.MapTo(s))
                .SingleAsync();
        }
        public async Task<IEnumerable<TaskDto>> GetTasks()
        {
            return await _storeContext.Tasks
                .Select(s => Helpers.Helpers.MapTo(s))
                .ToListAsync();
        }

        public async void DeleteTask(string id)
        {
            var task = await _storeContext.Tasks.FindAsync(id);

            if (task == null)
            {
                throw new ArgumentException("task is not found");
            }

            _storeContext.Remove(task);

            await _storeContext.SaveChangesAsync();
        }
    }
}
