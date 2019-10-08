import React, { useState } from 'react';
import { connect } from 'react-redux';
import { updateListSettings } from 'actions/notes';

// components
import Options from 'ui/Options/Options';
import Button from 'ui/Button/Button';

// types
import { CompletedPosition, ToDoListSettings } from 'types/notes';

// css
import s from 'pages/Notes/ToDos/ToDos.css';

type MapDispatch = typeof mapDispatch;

type Props = MapDispatch & {
  listId: string,
  noteId: string,
  settings: ToDoListSettings,
  handleCreateCopy: () => void,
};

const ListSettings: React.FC<Props> = (props) => {
  const { settings, listId, noteId } = props;
  const [currentPosition, setCurrentPosition] = useState(settings.completedPosition);

  const handlePositionChange = (completedPosition: CompletedPosition) => {
    setCurrentPosition(completedPosition);
    props.updateListSettings({
      noteId,
      listId,
      settings: {
        ...settings,
        completedPosition,
      },
    });
  };

  const positionOptions = [
    {
      value: 'top',
      label: 'top',
    },
    {
      value: 'bottom',
      label: 'bottom',
    },
    {
      value: 'off',
      label: 'off',
    },
  ];

  return (
    <div className={s.listSettings}>
      <div>
        Checked items&nbsp;
        <Options
          value={currentPosition}
          options={positionOptions}
          onChange={handlePositionChange}
        />
      </div>
      <Button
        text="Copy list"
        theme="primary"
        shape="text"
        icon="copy"
        onClick={props.handleCreateCopy}
        className={s.copyListButton}
      />
    </div>
  );
};

const mapDispatch = {
  updateListSettings,
};

export default connect(null, mapDispatch)(ListSettings);
