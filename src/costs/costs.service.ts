import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cost, CostsDocument } from '../schemas/costs.schema';
import { Model } from 'mongoose';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';

@Injectable()
export class CostsService {
  constructor(@InjectModel(Cost.name) private costsModel: Model<CostsDocument>) {
  }

  async findAllCosts(): Promise<Cost[]> {
    return this.costsModel.find();
  };

  async findOneCost(id: string): Promise<Cost> {
    return this.costsModel.findOne({ id });
  };

  async createCost(createCostDto: CreateCostDto): Promise<Cost> {
    const createdCost = new this.costsModel(createCostDto);
    return createdCost.save();
  };

  async updateCost(updateCostDto: UpdateCostDto, id: string): Promise<Cost> {
    await this.costsModel.updateOne(
      { _id: id },
      {
        $set: { ...updateCostDto },
      });

    return this.findOneCost(id);
  };

  async deleteCost(id: string): Promise<void> {
    //@ts-ignore
    return this.costsModel.deleteOne({ _id: id });
  }

}