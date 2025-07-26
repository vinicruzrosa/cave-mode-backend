d# Task Repository TypeScript Error Fix Plan

## Problem Analysis

The TypeScript compilation errors in `TaskRepository.ts` are caused by:

1. **Line 7**: Type mismatch when creating a task - the code tries to pass `{ userId: string; name: string }` but the Prisma Task model doesn't have these fields
2. **Line 11**: The `userId` field doesn't exist in `TaskWhereInput` for the Task model

## Root Cause

Looking at the Prisma schema, the `Task` model currently has:
- `id`, `routineId`, `title`, `description`, `startTime`, `endTime`, `requiresProof`, `proofType`
- It's related to User through Routine (Task -> Routine -> User)

However, the service layer expects:
- Direct `userId` field on Task
- `name` field instead of `title`
- `isCompleted` and `validated` fields for task completion tracking

## Solution: Modify Prisma Schema

### 1. Update Task Model

Add the following fields to the Task model in `src/prisma/schema.prisma`:

```prisma
model Task {
  id           String   @id @default(cuid())
  routineId    String?  // Make optional since tasks can exist without routines
  userId       String   // Add direct user relationship
  name         String   // Add name field (or rename title to name)
  title        String?  // Make optional or remove if using name
  description  String?
  startTime    DateTime?  // Make optional for simple tasks
  endTime      DateTime?  // Make optional for simple tasks
  requiresProof Boolean @default(false)
  proofType    ProofType?
  isCompleted  Boolean  @default(false)  // Add completion status
  validated    Boolean  @default(false)  // Add validation status
  createdAt    DateTime @default(now())  // Add creation timestamp
  routine      Routine? @relation(fields: [routineId], references: [id])  // Make optional
  user         User     @relation(fields: [userId], references: [id])     // Add direct user relation
  completions  TaskCompletion[]
}
```

### 2. Update User Model

Add the tasks relationship to the User model:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  completions TaskCompletion[]
  emergencyUsages EmergencyUsage[]
  settings  Settings?
  routines  Routine[]
  exceptions RoutineExceptionDay[]
  tasks     Task[]   // Add direct tasks relationship
}
```

### 3. Fix TaskRepository Methods

Update `src/repositories/TaskRepository.ts`:

```typescript
import { PrismaClient, Task, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskRepository {
  static async create(data: { userId: string; name: string }): Promise<Task> {
    return prisma.task.create({ 
      data: {
        userId: data.userId,
        name: data.name,
        isCompleted: false,
        validated: false
      }
    });
  }

  static async findByUser(userId: string): Promise<Task[]> {
    return prisma.task.findMany({ 
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  static async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.update({ where: { id }, data });
  }
}
```

## Implementation Steps

1. **Modify Prisma Schema**: Update the Task and User models as described above
2. **Generate Migration**: Run `npx prisma migrate dev --name add-task-user-fields`
3. **Generate Prisma Client**: Run `npx prisma generate`
4. **Update TaskRepository**: Fix the TypeScript types and method implementations
5. **Test Compilation**: Verify that TypeScript errors are resolved
6. **Test Functionality**: Ensure the task creation and querying still works

## Migration Considerations

- The `routineId` field becomes optional, so existing tasks might need data migration
- New fields (`userId`, `name`, `isCompleted`, `validated`) need default values for existing records
- Consider if existing `title` field should be renamed to `name` or if both should coexist

## Files to Modify

1. `src/prisma/schema.prisma` - Update Task and User models
2. `src/repositories/TaskRepository.ts` - Fix TypeScript types and implementations
3. Run database migration and client generation commands

This plan addresses both TypeScript compilation errors and aligns the database schema with the expected service layer behavior.