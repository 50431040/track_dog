import { EventEntryParams } from "@/types/event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeviceService {
  cleanDevice({ data }: EventEntryParams) {}
}
