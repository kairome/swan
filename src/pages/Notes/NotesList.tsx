import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// components
import NoteItem from 'pages/Notes/NoteItem';

// types
import { ReduxState } from 'types/redux';

// css
// @ts-ignore
import s from './Notes.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const NotesList: React.FC<Props> = (props) => {
  const renderNotes = () => {
    const notes = _.map(props.notes, (note) => {
      return (
        <NoteItem
          key={note._id}
          note={note}
        />
      );
    });

    return (
      <div className={s.notes}>
        {notes}
      </div>
    );
  };

  return (
    <div>
      {renderNotes()}
    </div>
  );
}

const mapState = (state: ReduxState) => {
  return {
    notes: state.notes.list,
  };
}

const mapDispatch = {};

export default connect(mapState, mapDispatch)(NotesList);
