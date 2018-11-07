type BaseEntity = {
  id: string;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  width: number;
  height: number;
  jumpCount: number;
};

type PlayerEntity = {
  type: 'player';
  lastJump?: number;
};

type PlatformEntity = {
  type: 'platform';
};

type ExtraEntity = PlayerEntity | PlatformEntity;

export type Entity = BaseEntity & ExtraEntity;

export type EntitiesState = Entity[];

export type UpdateEntityAction = {
  type: 'UPDATE_ENTITY',
  payload: {
    entity: Entity,
  },
};

export type InitEntitiesAction = {
  type: 'INIT_ENTITIES',
  payload: EntitiesState;
};

export const initEntities = (entities: EntitiesState) => ({
  type: 'INIT_ENTITIES',
  payload: entities,
});

type Action = UpdateEntityAction | InitEntitiesAction;

export default (state: EntitiesState = [], action: Action) => {
  switch (action.type) {
    case 'INIT_ENTITIES':
    return action.payload;
    case 'UPDATE_ENTITY':
    return state.map(entity => {
      if (entity.id === action.payload.entity.id) {
        return action.payload.entity;
      }
      return entity;
    });
  }
  return state;
};
