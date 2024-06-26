import { inject, injectable } from 'inversify';
import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { DefaultOfferService } from './offer.service.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { StatusCodes } from 'http-status-codes';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    private readonly offerService: DefaultOfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/offers',
      method: HttpMethod.Get,
      handler: this.index,
    });
    this.addRoute({
      path: '/offers',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });
    this.addRoute({
      path: '/offers/:id',
      method: HttpMethod.Get,
      handler: this.getById,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/offers/:id',
      method: HttpMethod.Patch,
      handler: this.updateById,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/offers/:id',
      method: HttpMethod.Delete,
      handler: this.deleteById,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumByCity,
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/favorites/:id',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/favorites/:id',
      method: HttpMethod.Delete,
      handler: this.removeFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.get();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    {
      body,
      tokenPayload,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateOfferDto
    >,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({
      ...body,
      host: tokenPayload.id,
    });
    const responseData = fillDTO(OfferRdo, result);
    this.created(res, responseData);
  }

  public async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const offer = await this.offerService.getById(id);

    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async updateById(
    {
      body,
      params,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      UpdateOfferDto
    >,
    res: Response
  ): Promise<void> {
    const id = params.id;
    const updatedOffer = await this.offerService.updateById(id as string, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async deleteById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    await this.offerService.deleteById(id);
    this.noContent(res);
  }

  public async getPremiumByCity(req: Request, res: Response): Promise<void> {
    const city = req.query.city;
    if (city) {
      const offers = await this.offerService.getPremiumByCity(city as string);
      const responseData = fillDTO(OfferRdo, offers);
      this.ok(res, responseData);
    } else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Bad request',
        'OfferController'
      );
    }
  }

  public async getFavorites(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.getFavorites();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async addFavorite(req: Request, res: Response): Promise<void> {
    const id = req.params['id'];

    const result = await this.offerService.addFavorite(id);
    const responseData = fillDTO(OfferRdo, result);
    this.ok(res, responseData);
  }

  public async removeFavorite(req: Request, res: Response): Promise<void> {
    const id = req.params['id'];

    const result = await this.offerService.removeFavorite(id);
    const responseData = fillDTO(OfferRdo, result);
    this.ok(res, responseData);
  }
}
