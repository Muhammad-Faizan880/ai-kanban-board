import api from "./api";

// Fetch all tasks for logged-in user
export const fetchTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

// Fetch single task by ID
export const fetchTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

// Create task
export const createTaskApi = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

// Update task status (Optimized for drag and drop)
export const updateTaskStatusApi = async (id, status) => {
  const response = await api.put(`/tasks/${id}/status`, { status });
  return response.data;
};

// Update task details / toggle subtasks
export const updateTaskApi = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

// Delete task
export const deleteTaskApi = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

// AI Task Decomposition
export const generateAITaskBreakdownApi = async (prompt) => {
  const response = await api.post("/tasks/ai-breakdown", { prompt });
  return response.data;
};

// AI Auto-Subtasks for existing task
export const generateAISubtasksApi = async (title, description) => {
  const response = await api.post("/tasks/ai-subtasks", { title, description });
  return response.data;
};

// AI Sprint Copilot & Board Advisor
export const aiSprintCopilotApi = async ({ action, prompt, tasksSummary }) => {
  const response = await api.post("/tasks/ai-copilot", { action, prompt, tasksSummary });
  return response.data;
};

