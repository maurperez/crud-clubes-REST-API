import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  Put,
  ParseIntPipe,
  BadRequestException,
  InternalServerErrorException,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'

import { ClubService } from './club.service'
import { NewClubValidationPipe, UpdateClubPipe } from './validation.pipe'
import { CreateClubDto } from './dto/create-club.dto'
import { ValidationError } from 'class-validator'
import { UpdateClubDto } from './dto/update-club.dto'
import { Club } from './club.entity'

@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService) {}

  @Get()
  findAll(): Promise<Club[]> {
    return this.clubService.findAll()
  }

  @Get(':id')
  async findUnique(@Param('id', ParseIntPipe) id: number): Promise<Club> {
    try {
      const clubInstace = await this.clubService.findUnique(id)
      return clubInstace
    } catch (error) {
      throw new NotFoundException()
    }
  }

  @Post()
  async create(
    @Body(NewClubValidationPipe) newClubDto: CreateClubDto,
  ): Promise<void> {
    try {
      await this.clubService.create(newClubDto)
    } catch (error) {
      if (error instanceof ValidationError)
        throw new BadRequestException([error])
      else {
        console.error(error)
        throw new InternalServerErrorException()
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(UpdateClubPipe) updateClubDto: UpdateClubDto,
  ): Promise<Club> {
    const clubInstance = await this.findUnique(id)

    try {
      await this.clubService.update(clubInstance, updateClubDto)
      return this.findUnique(id)
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException([error])
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.clubService.delete(id)
  }
}
