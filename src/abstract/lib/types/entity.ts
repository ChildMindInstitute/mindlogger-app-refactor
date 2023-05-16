export type EntityType = 'flow' | 'regular';

export type EntityPath = {
  appletId: string;
  eventId: string;
  entityId: string;
  entityType: EntityType;
};
