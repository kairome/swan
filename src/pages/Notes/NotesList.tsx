import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getLoader } from 'selectors/common';
import { moveArray } from 'utils/helpers';

// components
import NoteItem from 'pages/Notes/NoteItem';
import { SortList } from 'ui/Sortable/Sortable';

// types
import { ReduxState } from 'types/redux';

// css
import s from './Notes.css';

// types
import { DraggableSortArg } from 'types/entities';
import { updateNotes } from 'actions/notes';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & {
  isArchived?: boolean,
};

const NotesList: React.FC<Props> = (props) => {
  const [noteList, setNoteList] = useState(props.notes);
  useEffect(() => {
    if (!_.isEqual(props.notes, noteList)) {
      setNoteList(props.notes);
    }
  }, [props.notes]);

  const handleSort = (arg: DraggableSortArg) => {
    const { isArchived } = props;
    const sortedNotes = moveArray(arg.newIndex, arg.oldIndex, noteList);
    const newList = _.map(sortedNotes, (n, index) => ({ ...n, order: index }));
    setNoteList(newList);
    props.updateNotes({
      list: newList,
      withoutLoader: true,
      folderId: !isArchived ? newList[0].folder : undefined,
      isArchived: props.isArchived,
    });
  };
  const renderNotes = () => {
    if (props.notesLoading) {
      return null;
    }

    const notes = _.map(noteList, note => (
      <NoteItem
        key={note._id}
        note={note}
      />
    ));

    return (
      <SortList
        items={notes}
        onSortEnd={handleSort}
        className={s.notes}
        distance={20}
        axis="xy"
        useDragHandle
      />
    );
  };

  return (
    <div>
      {renderNotes()}
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  notes: state.notes.list,
  notesLoading: getLoader(state, 'notes'),
});

const mapDispatch = {
  updateNotes,
};

export default connect(mapState, mapDispatch)(NotesList);
