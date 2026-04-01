import { Project, CreateProjectDto, UpdateProjectDto } from './project.types';

describe('Project Types', () => {
  it('should define Project interface structure', () => {
    const project: Project = {
      id: '1',
      name: 'Test Project',
      description: 'A test project',
      color: '#FF5733',
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(project.id).toBe('1');
    expect(project.name).toBe('Test Project');
    expect(project.color).toBe('#FF5733');
  });

  it('should define CreateProjectDto structure', () => {
    const createDto: CreateProjectDto = {
      name: 'New Project',
      color: '#33FF57',
    };

    expect(createDto.name).toBe('New Project');
    expect(createDto.color).toBe('#33FF57');
  });

  it('should define UpdateProjectDto with optional fields', () => {
    const updateDto: UpdateProjectDto = {
      name: 'Updated Project',
    };

    expect(updateDto.name).toBe('Updated Project');
    expect(updateDto.description).toBeUndefined();
  });
});
