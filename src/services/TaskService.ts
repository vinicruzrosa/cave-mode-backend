import { TaskRepository } from '../repositories/TaskRepository';
import { TaskCompletionRepository } from '../repositories/TaskCompletionRepository';
import { EmergencyUsageRepository } from '../repositories/EmergencyUsageRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { validateImageWithHuggingFace } from '../utils/huggingFace';
import { getCurrentWeek } from '../utils/getCurrentWeek';

// Update ProofType to match Prisma enum values
type ProofType = 'TEXT' | 'PHOTO' | 'VIDEO' | null;

export class TaskService {
  static async createTask({
    userId,
    name,
    description,
    startTime,
    endTime,
    duration,
    requiresProof,
    proofType = null,
  }: {
    userId: string;
    name: string;
    description: string;
    startTime: Date;
    endTime?: Date | undefined;
    duration?: number;
    requiresProof: boolean;
    proofType?: ProofType | null;
  }) {
    return TaskRepository.create({
      user: { connect: { id: userId } },
      name,
      description,
      startTime,
      endTime,
      duration,
      requiresProof,
      proofType,
    });
  }

  static async listTasks(userId: string) {
    return TaskRepository.findByUser(userId);
  }

  static async completeTask({
    userId,
    taskId,
    proofData,
    usedEmergencyMode = false,
    emergencyJustification,
  }: {
    userId: string;
    taskId: string;
    proofData?: { type: 'TEXT' | 'PHOTO' | 'VIDEO' | 'CONFIRM'; content?: string };
    usedEmergencyMode?: boolean;
    emergencyJustification?: string;
  }) {
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
        const description = await validateImageWithHuggingFace(proofData.content!);
        proofUrl = proofData.content;
        if (description) {
          const d = description.toLowerCase();
          if (
            d.includes('selfie') &&
            (d.includes('sunlight') || d.includes('morning'))
          ) {
            validated = true;
          } else if (
            d.includes('pill') ||
            d.includes('medicine') ||
            d.includes('hand')
          ) {
            validated = true;
          } else if (
            d.includes('notebook') ||
            d.includes('writing') ||
            d.includes('page')
          ) {
            validated = true;
          }
        }
      } else if (proofData.type === 'CONFIRM') {
        validated = true;
      }
    }

    if (usedEmergencyMode) {
      const { week, year } = getCurrentWeek();
      const settings = await SettingsRepository.findByUserId(userId);
      const limit = settings?.emergencyModeLimit ?? 3;
      const count = await EmergencyUsageRepository.countByUserAndWeek(userId, week, year);
      if (count >= limit) throw new Error('Emergency mode limit reached');
      await EmergencyUsageRepository.create({
        userId,
        week,
        year,
      });
    }

    await TaskRepository.update(taskId, {
      isCompleted: true,
      validated,
    });

    await TaskCompletionRepository.create({
      task: { connect: { id: taskId } },
      user: { connect: { id: userId } },
      proofSubmitted,
      proofUrl,
      proofText,
      usedEmergencyMode,
      emergencyJustification,
    });

    return { success: true };
  }
}