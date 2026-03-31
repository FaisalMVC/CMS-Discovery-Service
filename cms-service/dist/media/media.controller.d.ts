import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    upload(episodeId: string, dto: CreateMediaDto, file?: Express.Multer.File): Promise<import("./entities/media.entity").Media>;
    remove(id: string): Promise<void>;
}
