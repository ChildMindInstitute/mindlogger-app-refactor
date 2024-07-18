import { AppletDetailsDto } from '@app/shared/api';
import { AppletModel } from '@entities/applet/';

export function mapAppletDetailsFromDto(dto: AppletDetailsDto) {
  return AppletModel.mapAppletDetailsFromDto(dto);
}
