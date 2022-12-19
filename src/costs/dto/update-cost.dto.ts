import { IsNotEmpty } from 'class-validator';

export class UpdateCostDto {
  @IsNotEmpty()
  readonly text: string;
  @IsNotEmpty()
  readonly price: number;
  @IsNotEmpty()
  readonly data: Date;

}