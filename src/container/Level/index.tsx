import useHandleEntitiesCreation, {
  PillPayload
} from "effects/useHandleEntitiesCreation";
import React from "react";
import { connect } from "react-redux";
import { State } from "store";
import { initPills, PlayerState } from "store/player";
import { EntitiesState, initEntities } from "store/entities";
import { GameState } from "store/game";
import { WindowState } from "store/window";

interface Props {
  dispatchInitEntities: (entities: EntitiesState) => void;
  initialEntities: EntitiesState;
  entities: EntitiesState;
  game: GameState;
  dispatchInitPills: (payload: PillPayload) => void;
  window: WindowState;
  player: PlayerState;
}

const styles = {
  player: {
    background: "red",
    borderRadius: "100%"
  },
  platform: {
    background: "blue"
  },
  door: {
    background: "green"
  },
  trap: {
    background: "black"
  }
};

const Level: React.SFC<Props> = ({
  game,
  dispatchInitEntities,
  dispatchInitPills,
  initialEntities,
  entities,
  window,
  player
}) => {
  useHandleEntitiesCreation({
    game,
    dispatchInitEntities,
    entities: initialEntities,
    dispatchInitPills,
    window
  });
  return (
    <div>
      {player.pills.map(({ x, y, id }) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: x,
            bottom: y,
            width: "20px",
            height: "20px",
            borderRadius: "100%",
            background: "purple"
          }}
        />
      ))}
      {entities.map(({ x, y, width, height, type }, index) => {
        const style = {
          ...styles[type],
          left: x,
          bottom: y,
          width,
          height
        };
        return <div key={index} style={{ ...style, position: "absolute" }} />;
      })}
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    entities: state.entities,
    game: state.game,
    window: state.window,
    player: state.player
  };
};

const mapDispatchToProps = {
  dispatchInitEntities: initEntities,
  dispatchInitPills: (payload: PillPayload) => initPills(payload)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Level);
