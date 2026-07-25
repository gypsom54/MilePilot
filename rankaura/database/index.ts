/**
 * Database repository contracts — implementation deferred.
 */

import type { Business } from "@/types/models/business";
import type { MemoryStore } from "@/types/models/memory";
import type { Task } from "@/types/models/task";
import type { User } from "@/types/models/user";

export interface BusinessRepository {
  findById(id: string): Promise<Business | null>;
  findByOwnerId(ownerId: string): Promise<Business[]>;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
}

export interface TaskRepository {
  findByBusinessId(businessId: string): Promise<Task[]>;
  save(task: Task): Promise<Task>;
}

export interface MemoryRepository {
  findByBusinessId(businessId: string): Promise<MemoryStore | null>;
  save(memory: MemoryStore): Promise<MemoryStore>;
}
