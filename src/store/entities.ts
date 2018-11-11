interface BaseEntity {
  id: string;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  width: number;
  height: number;
  jumpCount?: number;
  updateFn?: (entity: Entity) => Entity;
}

export type PlayerEntity = BaseEntity & {
  type: "player";
  lastJump?: number;
  jumpCount: number;
};

export type PlatformEntity = BaseEntity & {
  type: "platform";
  updateFn?: (entity: Entity) => Entity;
};

export type DoorEntity = BaseEntity & {
  type: "door",
};

export type TrapEntity = BaseEntity & {
  type: "trap",
};

export type Entity = PlayerEntity | PlatformEntity | DoorEntity | TrapEntity;

export type EntitiesState = Entity[];

export interface UpdateEntityAction {
  type: "UPDATE_ENTITY";
  payload: {
    entity: Entity,
  };
}

export interface InitEntitiesAction {
  type: "INIT_ENTITIES";
  payload: EntitiesState;
}

export const initEntities = (entities: EntitiesState) => ({
  type: "INIT_ENTITIES",
  payload: entities,
});

type Action = UpdateEntityAction | InitEntitiesAction;

export default (state: EntitiesState = [], action: Action) => {
  switch (action.type) {
    case "INIT_ENTITIES":
    return action.payload;
    case "UPDATE_ENTITY":
    return state.map((entity) => {
      if (entity.id === action.payload.entity.id) {
        return action.payload.entity;
      }
      return entity;
    });
  }
  return state;
};
