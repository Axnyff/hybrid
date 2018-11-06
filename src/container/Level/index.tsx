import React from 'react';
import { connect } from 'react-redux';
import { State } from 'store';
import { initEntities, EntitiesState } from 'store/entities';
import useHandleEntitiesCreation from 'effects/useHandleEntitiesCreation';

interface Props {
  dispatchInitEntities: (entities: EntitiesState) => void;
  initialEntities: EntitiesState;
  entities: EntitiesState;
};

const styles = {
  player: {
    background: 'red', borderRadius: '100%',
  },
  platform: {
    background: 'black',
  },
}

const Level : React.SFC<Props> = ({ dispatchInitEntities, initialEntities, entities }) => {
  useHandleEntitiesCreation({ dispatchInitEntities, entities: initialEntities });
  return (
    <React.Fragment>
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
    </React.Fragment>
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
