import {
  HandlerType,
  Task,
  HttpError,
  HttpStatus,
  handlerFn,
  Day,
} from '@tidy/types';
import { APIGatewayProxyEvent } from 'aws-lambda';

// new DBService().initialize();
// const noteService: INoteService = new NoteService();

const createTask: HandlerType<APIGatewayProxyEvent, Promise<Task>> = async (
  event
): Promise<Task> => {
  const userId = event.requestContext?.authorizer?.['claims']?.['sub'];

  if (!userId) {
    throw new HttpError('Invalid user', HttpStatus.FORBIDDEN);
  }

  // const dto = JSON.parse(event.body ?? '') as CreateTaskDto;

  //   const newNote = await noteService.createNote(userId, dto);
  const newNote = {
    id: '1',
    title: 'Test Task',
    day: Day.Monday,
    fullDate: '2021-01-01',
  };

  if (!newNote) {
    throw new HttpError(
      'Failed to create your note',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  return newNote;
};

export const handler = handlerFn(createTask, {
  successStatusCode: HttpStatus.CREATED,
  logContextBuilder: (event) => ({
    path: event.path,
    requestId: event.requestContext?.requestId,
  }),
});
