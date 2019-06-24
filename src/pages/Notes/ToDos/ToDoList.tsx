import React from 'react';
import _ from 'lodash';
import { moveArray } from 'utils/helpers';
import classNames from 'classnames';

// components
import Button from 'ui/Button/Button';
import Input from 'ui/Input/Input';
import CheckBox from 'ui/Checkbox/Checkbox';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortableContainerProps,
  SortableElementProps,
} from 'react-sortable-hoc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// types
import { ToDoItem } from 'types/notes';
import { DraggableSortArg } from 'types/entities';

// css
// @ts-ignore
import s from './ToDos.css';

interface Props {
  items: ToDoItem[],
  save: (i: ToDoItem[]) => void,
}

interface State {
  todos: ToDoItem[],
  focusedIndex: number,
}

type ListProps = SortableContainerProps & {
  items: JSX.Element[],
};

type ListItemProps = SortableElementProps & {
  value: JSX.Element,
};

const Handle = SortableHandle(() => <div className={s.itemHandleIcon}><FontAwesomeIcon icon="grip-horizontal" /></div>)

const ListItem = SortableElement((props: ListItemProps) => <div>{props.value}</div>);

const List = SortableContainer((props: ListProps) => {
  return (
    <div>
      {_.map(props.items, (item, i: number) => <ListItem value={item} key={`sort-todo-${i}`} index={i} />)}
    </div>
  );
});

class ToDoList extends React.Component<Props, State> {
  state = {
    todos: this.props.items,
    focusedIndex: -1,
  };

  private currentInput: any;

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.state.focusedIndex !== -1 && this.currentInput) {
      this.currentInput.focus();
    }
  }

  assignRef = (index: number) => (elem: any) => {
    if (index === this.state.focusedIndex) {
      this.currentInput = elem;
    }
  }

  handleAdd = (index?: number) => {
    const todos = [...this.state.todos];
    const newTodo = {
      name: '',
      completed: false,
    };

    if (typeof index === 'number') {
      todos.splice(index, 0, newTodo);
    } else {
      todos.push(newTodo);
    }

    this.setState({
      todos,
      focusedIndex: typeof index === 'number' ? index : todos.length,
    });
    this.props.save(todos);
  }

  handleRemoveClick = (index: number) => () => {
    this.handleRemove(index);
  }

  handleRemove = (index: number) => {
    const todos = [...this.state.todos];
    todos.splice(index, 1);
    this.setState({ todos });
    this.props.save(todos);
  }

  handleNameChange = (index: number) => (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const todos = [...this.state.todos];
    todos[index].name = value;
    this.setState({ todos, focusedIndex: index });
  }

  handleKeyPress = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key, currentTarget } = e;
    if (key === 'Enter') {
      this.handleAdd(index + 1);
    }

    const selection = currentTarget.selectionStart;
    const valueLength = currentTarget.value.length;

    const nextKey = key === 'ArrowDown' || key === 'ArrowRight';
    const prevKey = key === 'ArrowUp' || key === 'ArrowLeft';
    const nextIndex = index + 1;
    const prevIndex = index - 1;
    if (nextKey && selection === valueLength && this.state.todos.length !== nextIndex) {
      e.preventDefault();
      currentTarget.blur();
      this.setState({ focusedIndex: index + 1 });
    }

    if (prevKey && selection === 0 && prevIndex >= 0) {
      e.preventDefault();
      currentTarget.blur();
      this.setState({ focusedIndex: index - 1 });
    }

    if (key === 'Escape') {
      currentTarget.blur();
      this.handleBlur();
    }

    const removeEvent = key === 'Backspace' && !currentTarget.value;
    if (key === 'Delete' || removeEvent) {
      this.handleRemove(index);
      e.preventDefault();
    }
  }

  handleBlur = () => {
    this.setState({ focusedIndex: -1 });
    this.props.save(this.state.todos);
  }

  handleFocus = (index: number) => () => {
    this.setState({ focusedIndex: index });
  }

  handleComplete = (index: number) => (e: React.FormEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    const todos = [...this.state.todos];
    todos[index].completed = checked;
    this.setState({ todos });
    this.props.save(todos);
  }

  handleSort = (arg: DraggableSortArg) => {
    const sortedTodos = moveArray(arg.newIndex, arg.oldIndex, this.state.todos);
    this.setState({ todos: sortedTodos });
    this.props.save(sortedTodos);
  }

  renderItems = () => {
    const { todos, focusedIndex } = this.state;
    const list = _.map(todos, (todo, i) => {
      const { name } = todo;
      const key = `note-todo-${i}`;
      const itemClasses = classNames(s.todoItem, {
        [s.focused]: focusedIndex === i,
      });
      return (
        <div key={key} className={itemClasses}>
          <Handle />
          <CheckBox
            id={key}
            checked={todo.completed}
            onChange={this.handleComplete(i)}
          />
          <Input
            type="text"
            value={name}
            assignRef={this.assignRef(i)}
            onChange={this.handleNameChange(i)}
            className={todo.completed ? s.checkedItem : ''}
            onKeyDown={this.handleKeyPress(i)}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus(i)}
            embedded
          />
          <div className={s.itemRemoveIcon} onClick={this.handleRemoveClick(i)}>
            <FontAwesomeIcon icon="trash" />
          </div>
        </div>
      );
    });

    return (
      <div className={s.todoList}>
        <List
          items={list}
          onSortEnd={this.handleSort}
          useDragHandle
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Button
          text="+ New todo"
          theme="info"
          shape="link"
          onClick={this.handleAdd}
        />
        {this.renderItems()}
      </div>
    );
  }
}

export default ToDoList;
