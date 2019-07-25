import React from 'react';

// components
import PositionSettings from 'pages/Notes/ToDos/PositionSettings';

// types
import { CompletedPosition, ToDoListSettings } from 'types/notes';

// css
import s from 'pages/Notes/ToDos/ToDos.css';
import { connect } from 'react-redux';
import { updateListSettings } from 'actions/notes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type MapDispatch = typeof mapDispatch;

type Props = MapDispatch & {
  listKey: string,
  listIndex: number,
  noteId: string,
  settings: ToDoListSettings,
  handleCreateCopy: () => void,
}

const ListSettings: React.FC<Props> = (props) => {
  const { listKey, settings, listIndex, noteId } = props;

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
      <div className={s.copyList} onClick={props.handleCreateCopy}>
        <FontAwesomeIcon icon="copy" /> Copy list
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
