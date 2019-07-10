import React from 'react';

// components
import PositionSettings from 'pages/Notes/ToDos/PositionSettings';

// types
import { CompletedPosition, ToDoListSettings } from 'types/notes';

// css
import s from 'pages/Notes/ToDos/ToDos.css';
import { connect } from 'react-redux';
import { updateListSettings } from 'actions/notes';

type MapDispatch = typeof mapDispatch;

type Props = MapDispatch & {
  listKey: string,
  listIndex: number,
  noteId: string,
  settings: ToDoListSettings,
  checked: number,
  all: number,
}

const ListSettings: React.FC<Props> = (props) => {
  const { listKey, settings, listIndex, noteId, checked, all } = props;

  const handlePositionChange = (completedPosition: CompletedPosition) => {
    props.updateListSettings({
      noteId,
      listIndex,
      settings: {
        ...settings,
        completedPosition,
      },
    });
  };
  return (
    <div className={s.listSettings}>
      <div className={s.listStat}>
        <span className={s.listStatNumber}>{checked}</span>
        &nbsp;out of <span className={s.listStatNumber}>{all}</span> items completed
      </div>
      <PositionSettings
        listKey={listKey}
        value={settings.completedPosition}
        onChange={handlePositionChange}
      />
    </div>
  );
};

const mapDispatch = {
  updateListSettings,
};

export default connect(null, mapDispatch)(ListSettings);
