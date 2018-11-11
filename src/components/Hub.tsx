import React from "react";

type Props = {
  level: number;
  eatenPills: string[];
};

const Hub = ({ level, eatenPills }: Props) => (
  <React.Fragment>
    <span>Current level: {level}</span>
    {eatenPills.length > 0 && (
      <div>
        <span>Eaten pills:</span>
        <ul>
          {eatenPills.map((id: string, index: number) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
      </div>
    )}
  </React.Fragment>
);

export default Hub;
