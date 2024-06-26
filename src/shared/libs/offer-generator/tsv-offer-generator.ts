import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import {
  Amenities,
  CityName,
  MockServerData,
  OfferType,
  UserType,
} from '../../types/index.js';
import { OfferGenerator } from './offer-generator.interface.js';

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_RENT = 100;
const MAX_RENT = 100_000;

const CITIES = [
  {
    city: CityName.Amsterdam,
    latitude: 52.370216,
    longitude: 4.895168,
  },
  {
    city: CityName.Brussels,
    latitude: 50.846557,
    longitude: 4.351697,
  },
  {
    city: CityName.Cologne,
    latitude: 50.938361,
    longitude: 6.959974,
  },
  {
    city: CityName.Dusseldorf,
    latitude: 51.225402,
    longitude: 6.776314,
  },
  {
    city: CityName.Hamburg,
    latitude: 53.550341,
    longitude: 10.000654,
  },
  {
    city: CityName.Paris,
    latitude: 48.85661,
    longitude: 2.351499,
  },
];

const BOOLEANS = ['true', 'false'];

const OFFER_TYPES = [
  OfferType.Apartment,
  OfferType.Hotel,
  OfferType.House,
  OfferType.Room,
];

const AMENITIES = [
  Amenities.AirConditioning,
  Amenities.BabySeat,
  Amenities.Breakfast,
  Amenities.Fridge,
  Amenities.LaptopFriendlyWorkspace,
  Amenities.Towels,
  Amenities.Washer,
];

const USER_TYPES = [UserType.Regular, UserType.Pro];

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const cityInfo = getRandomItem(CITIES);
    const { city, latitude, longitude } = cityInfo;
    const imagePreview = getRandomItem(this.mockData.imagePreviews);
    const photos = getRandomItems(this.mockData.photos).join(';');
    const isPremium = getRandomItem(BOOLEANS);
    const isFavorite = getRandomItem(BOOLEANS);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING);
    const type = getRandomItem(OFFER_TYPES);
    const roomCount = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const guestCount = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const rentPrice = generateRandomValue(MIN_RENT, MAX_RENT);
    const amenities = getRandomItems(AMENITIES).join(';');
    const name = getRandomItem(this.mockData.names);
    const email = getRandomItem(this.mockData.emails);
    const avatarUrl = getRandomItem(this.mockData.avatars);
    const password = getRandomItem(this.mockData.passwords);
    const userType = getRandomItem(USER_TYPES);
    const coordinates = [latitude, longitude].join(';');

    return [
      title,
      description,
      city,
      imagePreview,
      photos,
      isPremium,
      isFavorite,
      rating,
      type,
      roomCount,
      guestCount,
      rentPrice,
      amenities,
      name,
      email,
      avatarUrl,
      password,
      userType,
      coordinates,
    ].join('\t');
  }
}
