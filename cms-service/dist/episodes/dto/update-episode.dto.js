"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEpisodeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_episode_dto_1 = require("./create-episode.dto");
class UpdateEpisodeDto extends (0, swagger_1.PartialType)(create_episode_dto_1.CreateEpisodeDto) {
}
exports.UpdateEpisodeDto = UpdateEpisodeDto;
//# sourceMappingURL=update-episode.dto.js.map