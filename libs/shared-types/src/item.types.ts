export interface Item {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDto {
  name: string;
  description?: string;
  projectId: string;
}

export interface UpdateItemDto {
  name?: string;
  description?: string;
}
