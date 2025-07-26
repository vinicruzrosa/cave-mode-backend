import { TaskCompletionRepository } from '../repositories/TaskCompletionRepository';
import { EmergencyUsageRepository } from '../repositories/EmergencyUsageRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { getCurrentWeek } from '../utils/getCurrentWeek';

export class ReportService {
  static async tasksToday(userId: string) {
    const today = new Date();
    return TaskCompletionRepository.findByUserAndDate(userId, today);
  }

  static async weeklyReport(userId: string, start: Date, end: Date) {
    const completions = await TaskCompletionRepository.findByUserAndRange(userId, start, end);
    // Agrupar por dia da semana
    const stats: Record<string, number> = {};
    completions.forEach(c => {
      const day = new Date(c.completedAt).toLocaleDateString('en-US', { weekday: 'long' });
      stats[day] = (stats[day] || 0) + 1;
    });
    return stats;
  }

  static async emergencyUsage(userId: string) {
    const { week, year } = getCurrentWeek();
    const count = await EmergencyUsageRepository.countByUserAndWeek(userId, week, year);
    const settings = await SettingsRepository.findByUserId(userId);
    const limit = settings?.emergencyModeLimit ?? 3;
    return { used: count, remaining: limit - count };
  }
} 