import {
  Ref,
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { UserEntity } from '../user';
import { OfferEntity } from '../offer';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  },
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 5, maxlength: 1024, type: () => String })
  public comment: string;

  @prop({ required: true, type: () => Date })
  public publishDate: Date;

  @prop({ required: true, min: 1, max: 5, type: () => Number })
  public rating: number;

  @prop({ required: true, ref: OfferEntity })
  public offer: Ref<OfferEntity>;

  @prop({ required: true, ref: () => UserEntity })
  public user: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
