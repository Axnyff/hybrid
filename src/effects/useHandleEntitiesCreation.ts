import { useEffect } from 'react';
import { EntitiesState } from 'store/entities';

type Args = {
  entities: EntitiesState;
  dispatchInitEntities: (entities: EntitiesState) => void;
};

export default ({ dispatchInitEntities, entities }: Args) => {
  useEffect(() => {
    dispatchInitEntities(entities);
  }, [entities]);
};
