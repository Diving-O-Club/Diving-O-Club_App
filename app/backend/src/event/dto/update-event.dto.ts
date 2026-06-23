// PartialType from @nestjs/swagger (not @nestjs/mapped-types) so the inherited
// @ApiProperty metadata is carried over to Swagger as optional fields.
import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

/** Payload submitted to `PUT /events/:id` — every field is optional. */
export class UpdateEventDto extends PartialType(CreateEventDto) {}
