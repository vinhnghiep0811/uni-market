import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';

function toTrimmedStringOrUndefined(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function toTrimmedStringOrNull(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

export class UpdateProfileDto {
  @Transform(({ value }) => toTrimmedStringOrUndefined(value))
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  @Transform(({ value }) => toTrimmedStringOrNull(value))
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string | null;

  @Transform(({ value }) => toTrimmedStringOrNull(value))
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  facebookLink?: string | null;

  @Transform(({ value }) => toTrimmedStringOrNull(value))
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  avatarUrl?: string | null;
}
