import React from 'react';
import { connect } from 'react-redux';
import { State } from 'store';
import { initEntities, EntitiesState } from 'store/entities';
import { GameState } from 'store/game';
import useHandleEntitiesCreation from 'effects/useHandleEntitiesCreation';

interface Props {
  dispatchInitEntities: (entities: EntitiesState) => void;
  initialEntities: EntitiesState;
  entities: EntitiesState;
  game: GameState;
};

const styles = {
  player: {
    background: 'red', borderRadius: '100%',
  },
  platform: {
    background: 'blue',
  },
  door: {
    background: 'green',
  },
  trap: {
    background: 'black',
  },
}

const Level : React.SFC<Props> = ({ game, dispatchInitEntities, initialEntities, entities }) => {
  useHandleEntitiesCreation({ game, dispatchInitEntities, entities: initialEntities });
  return (
    <div>
      {entities.map(({ x, y, width, height, id, type }) => {
        const style = {
          ...styles[type],
          left: x, bottom: y, width, height 
        };
        return (
          <div
            key={id}
            style={{...style, position: 'absolute'}}
          />
        );
      })}
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    entities: state.entities,
    game: state.game,
  };
};

const mapDispatchToProps = {
  dispatchInitEntities: initEntities,
};

export default connect(mapStateToProps, mapDispatchToProps)(Level);
