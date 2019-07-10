import React from 'react';
import _ from 'lodash';
import { moveArray } from 'utils/helpers';
import classNames from 'classnames';

// components
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
import { CompletedPosition, ToDoItem } from 'types/notes';
import { DraggableSortArg } from 'types/entities';

// css
// @ts-ignore
import s from './ToDos.css';

interface Props {
  items: ToDoItem[],
  completedPosition: CompletedPosition,
  listKey: string,
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

class ToDoItems extends React.Component<Props, State> {
  state = {
    todos: this.props.items,
    focusedIndex: -1,
  };

  private currentInput: any;
  private todoTimeout: number | null;

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const { completedPosition } = this.props;
    if (this.state.focusedIndex !== -1 && this.currentInput) {
      this.currentInput.focus();
    }

    if (completedPosition !== prevProps.completedPosition) {
      const sorted = this.getSortedToDos(this.state.todos);
      this.setState({ todos: sorted });
      this.props.save(sorted);
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
      focusedIndex: typeof index === 'number' ? index : todos.length - 1,
    });
    this.props.save(todos);
  }

  handleNew = () => {
    const { completedPosition } = this.props;
    if (completedPosition === 'bottom') {
      this.handleAdd(0);
      return;
    }

    this.handleAdd();
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

  handleTextChange = (index: number) => (e: React.FormEvent<HTMLInputElement>) => {
    if (this.todoTimeout !== null) {
      clearTimeout(this.todoTimeout);
    }

    const { value } = e.currentTarget;
    const todos = [...this.state.todos];
    todos[index].name = value;
    this.setState({ todos, focusedIndex: index });
    this.todoTimeout = window.setTimeout(() => {
      this.props.save(this.state.todos);
    }, 2000);
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
      this.handleSaveToDos();
    }

    const removeEvent = key === 'Backspace' && !currentTarget.value;
    if (key === 'Delete' || removeEvent) {
      this.handleRemove(index);
      e.preventDefault();
    }
  }

  handleSaveToDos = () => {
    this.setState({ focusedIndex: -1 });
    this.props.save(this.state.todos);
  }

  handleFocus = (index: number) => () => {
    this.setState({ focusedIndex: index });
  }

  getSortedToDos = (todos: ToDoItem[]) => {
    const { completedPosition } = this.props;
    if (completedPosition === 'top') {
      return _.orderBy(todos, t => t.completed, 'desc');
    }

    if (completedPosition === 'bottom') {
      return _.orderBy(todos, t => t.completed, 'asc');
    }

    return todos;
  }

  handleComplete = (index: number) => (e: React.FormEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    const todos = [...this.state.todos];
    todos[index].completed = checked;
    const sorted = this.getSortedToDos(todos);

    this.setState({ todos: sorted });
    this.props.save(sorted);
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
            id={`${key}-${this.props.listKey}`}
            checked={todo.completed}
            onChange={this.handleComplete(i)}
          />
          <Input
            type="text"
            value={name}
            assignRef={this.assignRef(i)}
            onChange={this.handleTextChange(i)}
            className={todo.completed ? s.checkedItem : ''}
            onKeyDown={this.handleKeyPress(i)}
            onBlur={this.handleSaveToDos}
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

  renderAddTodo = () => {
    const { completedPosition } = this.props;
    const topClass = completedPosition === 'bottom' ? s.addTodoTop : '';
    return (
      <div className={`${s.addTodoItem} ${topClass}`} onClick={this.handleNew}>
        + Item
      </div>
    );
  }

  render() {
    return (
      <div className={s.todoListContainer}>
        {this.renderAddTodo()}
        {this.renderItems()}
      </div>
    );
  }
}

export default ToDoItems;