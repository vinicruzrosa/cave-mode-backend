import { TaskRepository } from '../repositories/TaskRepository';
import { TaskCompletionRepository } from '../repositories/TaskCompletionRepository';
import { EmergencyUsageRepository } from '../repositories/EmergencyUsageRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { validateImageWithHuggingFace } from '../utils/huggingFace';
import { getCurrentWeek } from '../utils/getCurrentWeek';

export class TaskService {
  static async createTask(userId: string, name: string) {
    return TaskRepository.create({ userId, name });
  }

  static async listTasks(userId: string) {
    return TaskRepository.findByUser(userId);
  }

  static async completeTask({
    userId,
    taskId,
    proofData,
    usedEmergencyMode = false,
    emergencyJustification
  }: {
    userId: string;
    taskId: string;
    proofData?: { type: 'TEXT' | 'PHOTO' | 'VIDEO' | 'CONFIRM'; content?: string };
    usedEmergencyMode?: boolean;
    emergencyJustification?: string;
  }) {
    // Buscar task
    const task = await TaskRepository.findById(taskId);
    if (!task || task.userId !== userId) throw new Error('Task not found');
    if (task.isCompleted) throw new Error('Task already completed');

    let validated = false;
    let proofSubmitted = false;
    let proofUrl: string | undefined;
    let proofText: string | undefined;

    if (proofData) {
      proofSubmitted = true;
      if (proofData.type === 'TEXT') {
        validated = !!proofData.content;
        proofText = proofData.content;
      } else if (proofData.type === 'PHOTO' || proofData.type === 'VIDEO') {
        // Validação Hugging Face
        const description = await validateImageWithHuggingFace(proofData.content!);
        proofUrl = proofData.content;
        // Regras de validação
        if (description) {
          if (
            description.includes('selfie') &&
            (description.includes('sunlight') || description.includes('morning'))
          ) {
            validated = true;
          } else if (
            description.includes('pill') ||
            description.includes('medicine') ||
            description.includes('hand')
          ) {
            validated = true;
          } else if (
            description.includes('notebook') ||
            description.includes('writing') ||
            description.includes('page')
          ) {
            validated = true;
          }
        }
      } else if (proofData.type === 'CONFIRM') {
        validated = true;
      }
    }

    // Emergência: checar limite semanal
    if (usedEmergencyMode) {
      const { week, year } = getCurrentWeek();
      const settings = await SettingsRepository.findByUserId(userId);
      const limit = settings?.emergencyModeLimit ?? 3;
      const count = await EmergencyUsageRepository.countByUserAndWeek(userId, week, year);
      if (count >= limit) throw new Error('Emergency mode limit reached');
      await EmergencyUsageRepository.create({ userId, week, year });
    }

    // Marcar tarefa como concluída
    await TaskRepository.update(taskId, { isCompleted: true, validated });
    // Registrar completion
    await TaskCompletionRepository.create({
      taskId,
      userId,
      proofSubmitted,
      proofUrl,
      proofText,
      usedEmergencyMode,
      emergencyJustification,
    });
    return { success: true };
  }
} 