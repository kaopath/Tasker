using Microsoft.AspNetCore.Mvc;
using Task.Interfaces;
using Common.Filters;
using Common.Models;
using Task.Models;
using Common.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;

namespace Task.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TasksController : ControllerBase
    {
        readonly ITaskService _taskService;
        readonly IMemoryCache _cache;
        public TasksController(ITaskService taskService, IMemoryCache cache)
        {
            _taskService = taskService;
            _cache = cache;
        }
        [HttpGet]
        public async Task<IEnumerable<TaskDto>> Get()
        {
            string cacheKey = string.Format(Consts.TaskConsts.GET_TASKS, HttpContext.GetUserId());
            return await _cache.GetOrCreateAsync(cacheKey, async (entry) =>
            {
                return await _taskService.GetTasks();
            });
        }

        [HttpGet("{id}")]
        public async Task<TaskDto> Get(string id)
        {
            return await _taskService.GetTask(id);

        }

        [HttpPost]
        [ModelStateValidationFilter]
        public async Task<TaskDto> Post([FromBody] TaskDto taskDto)
        {
            string cacheKey = string.Format(Consts.TaskConsts.GET_TASKS, HttpContext.GetUserId());
            _cache.Remove(cacheKey);
            return await _taskService.AddTask(new Common.Models.Task()
            {
                UserId = taskDto.UserId,
                Description = taskDto.Description,
                StartTime = taskDto.StartTime,
                Status = taskDto.Status,
                Subject = taskDto.Subject,
                Date = taskDto.Date,
                EndTime = taskDto.EndTime,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        [HttpPut("{id}")]
        [ModelStateValidationFilter]
        public async Task<TaskDto> Put(string id, [FromBody] TaskDto taskDto)
        {
            string cacheKey = string.Format(Consts.TaskConsts.GET_TASKS, HttpContext.GetUserId());
            _cache.Remove(cacheKey);
            return await _taskService.UpdateTask(id, new Common.Models.Task()
            {
                UserId = taskDto.UserId,
                Description = taskDto.Description,
                StartTime = taskDto.StartTime,
                Status = taskDto.Status,
                Subject = taskDto.Subject,
                Date = taskDto.Date,
                EndTime = taskDto.EndTime,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            string cacheKey = string.Format(Consts.TaskConsts.GET_TASKS, HttpContext.GetUserId());
            _cache.Remove(cacheKey);
            _taskService.DeleteTask(id);
        }
    }
}
