import { inject, injectable } from 'inversify';
import { Component, SortType } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT } from './offer.constant.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({
      ...dto,
      publishDate: new Date(),
      rating: 1,
      isFavorite: false,
    });
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async getById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('host').exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('host')
      .exec();
  }

  public async deleteById(
    id: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(id).exec();
  }

  public async get(
    offerCount?: number
  ): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(offerCount ?? DEFAULT_OFFER_COUNT)
      .populate('host')
      .exec();
  }

  public async getPremiumByCity(
    city: string
  ): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel
      .find({ isPremium: true, 'city.name': city })
      .sort({ createdAt: SortType.Down })
      .limit(PREMIUM_OFFER_COUNT)
      .populate('host')
      .exec();
  }

  public async getFavorites(): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel.find({ isFavorite: true }).populate('host').exec();
  }

  public async addFavorite(
    id: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, { isFavorite: true }, { new: true })
      .populate('host')
      .exec();
  }

  public async removeFavorite(
    id: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, { isFavorite: false }, { new: true })
      .populate('host')
      .exec();
  }

  public async updateCommentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentCount: 1,
        },
      })
      .populate('host')
      .exec();
  }

  public async exists(offerId: string): Promise<boolean> {
    return this.offerModel.exists({ id: offerId }).exec() !== null;
  }
}
