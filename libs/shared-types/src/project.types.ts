export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  color: string;
}

// Validation rules for CreateProjectDto:
// - name: minimum 1 character, maximum 100 characters
// - color: valid hex color format (#RRGGBB)

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  color?: string;
}
