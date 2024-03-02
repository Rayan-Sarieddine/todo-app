import { PriorityLevel } from '../dto/create-todo.dto';

export class Todo {
  id: number;
  userId: number;
  title: string;
  description?: string;
  priorityLevel: PriorityLevel;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  pinned: boolean;
}
