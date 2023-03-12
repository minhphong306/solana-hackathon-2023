import { Types } from 'mongoose';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export default class ParseObjectIdPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any): Types.ObjectId {
    const validObjectId: boolean = isObjectId(value);

    if (validObjectId) {
      throw new BadRequestException('Invalid ObjectId');
    }

    const objectId = toObjectId(value);
    return objectId;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObjectId(id: any) {
  return id instanceof Types.ObjectId;
}

/**
 * NOTE:
 * https://github.com/Automattic/mongoose/issues/2853
 * https://github.com/mongodb/js-bson/issues/112
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toObjectId(idStr: any): Types.ObjectId {
  if(!idStr) return null;
  let id = null;
  try {
    id = new Types.ObjectId(idStr);
  } catch (err) {} // eslint-disable-line no-empty
  return id;
}
