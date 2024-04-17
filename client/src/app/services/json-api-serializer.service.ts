import { Injectable } from '@angular/core';
import { Serializer } from 'jsonapi-serializer';

/** 
 * This could use a rework but it did the job for quick serialization for
 * JSONAPI requests.
 */
@Injectable({
  providedIn: 'root'
})
export class JsonApiSerializerService {

  constructor() { }

  private readonly USER_SERAILIZER = new Serializer('user', {
    attributes: ['username', 'email', 'password']
  });

  private readonly IMAGE_SERAILIZER = new Serializer('image', {
    attributes: ['status', 'image', 'date', 'owner' ]
  });

  private readonly COMMENT_SERAILIZER = new Serializer('comment', {
    attributes: ['comment', 'date', 'imageid' ]
  });

  public serializeUser(userData: {}): any {
    return this.USER_SERAILIZER.serialize(userData);
  }

  public serializeImage(imageData: {}): any {
    return this.IMAGE_SERAILIZER.serialize(imageData);
  }

  public serializeComment(commentData: {}): any {
    return this.COMMENT_SERAILIZER.serialize(commentData);
  }
}
