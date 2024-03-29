import React, { useEffect, useState } from "react";
import Nav from "../../components/common/Nav";
import Footer from "../../components/common/Footer";
import { useDispatch } from "react-redux";
import {
  TodoItem,
  todoDataSource,
} from "../../../core/dataSource/remoteDataSource/todo";
import { saveTodos } from "../../../core/dataSource/localDataSource/Todo";
import TodoComponent from "../../components/pageComponents/Todo";
import { useNavigate } from "react-router-dom";

import "./style.css";
import { local } from "../../../core/helpers/localStorage";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [groupedTodos, setGroupedTodos] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("All");

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => !prev);
  };

  const formatDate = (date: string) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0];

    return date === today ? "Today" : date === tomorrow ? "Tomorrow" : date;
  };

  const getTodos = async () => {
    const token = local("token");
    if (!token || token === null || token === "") return;
    const response = await todoDataSource.getTodos();
    dispatch(saveTodos(response));

    const filteredTodos = response.filter((todo: TodoItem) => {
      const matchesSearchTerm = todo.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      let matchesRadioSelection = true;
      switch (selectedOption) {
        case "CompletedTodos":
          matchesRadioSelection = todo.completed;
          break;
        case "UnCompletedTodos":
          matchesRadioSelection = !todo.completed;
          break;
        case "PinnedTodos":
          matchesRadioSelection = todo.pinned;
          break;
        default:
          break;
      }
      return matchesSearchTerm && matchesRadioSelection;
    });

    const groupedByDate: { [key: string]: TodoItem[] } = {};
    filteredTodos.forEach((todo: TodoItem) => {
      const dateKey = todo.date.split("T")[0];
      groupedByDate[dateKey] = groupedByDate[dateKey] || [];
      groupedByDate[dateKey].push(todo);
    });

    const priorityMapping = { TOP: 1, MEDIUM: 2, LOW: 3 };

    Object.keys(groupedByDate).forEach((date) => {
      groupedByDate[date].sort(
        (a: TodoItem, b: TodoItem) =>
          priorityMapping[a.priorityLevel] - priorityMapping[b.priorityLevel]
      );
    });

    const sortedGroupedTodos = Object.keys(groupedByDate)
      .sort()
      .reduce((acc: { [key: string]: TodoItem[] }, date) => {
        acc[date] = groupedByDate[date];
        return acc;
      }, {});

    setGroupedTodos(sortedGroupedTodos);
  };

  useEffect(() => {
    getTodos();
  }, [refreshTrigger, searchTerm, selectedOption]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="home">
      <Nav />
      <div className="todo-section">
        <div className="todos-filters">
          <div className="todo-filter-search">
            <input
              type="text"
              placeholder="Filter Todos by Title"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="todo-filter-select">
            <h2>Filter Todos</h2>
            <div className="todo-filter-select_item">
              <input
                type="radio"
                value="All"
                checked={selectedOption === "All"}
                onChange={handleRadioChange}
              />
              <label>All</label>
            </div>
            <div className="todo-filter-select_item">
              <input
                type="radio"
                value="CompletedTodos"
                checked={selectedOption === "CompletedTodos"}
                onChange={handleRadioChange}
              />
              <label>Completed Todos</label>
            </div>
            <div className="todo-filter-select_item">
              <input
                type="radio"
                value="UnCompletedTodos"
                checked={selectedOption === "UnCompletedTodos"}
                onChange={handleRadioChange}
              />
              <label>UnCompleted Todos</label>
            </div>
            <div className="todo-filter-select_item">
              <input
                type="radio"
                value="PinnedTodos"
                checked={selectedOption === "PinnedTodos"}
                onChange={handleRadioChange}
              />
              <label>Pinned Todos</label>
            </div>
          </div>
        </div>
        <div className="todos">
          <button
            className="btn todos-btn"
            onClick={() => {
              navigate("/add-todo");
            }}
          >
            Add Todo
          </button>
          {Object.entries(groupedTodos).map(([date, todos]: any) => (
            <div className="todo-item" key={date}>
              <h2>{formatDate(date)}</h2>
              {todos.map((todo: any) => (
                <TodoComponent
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  description={todo.description}
                  pinned={todo.pinned}
                  completed={todo.completed}
                  date={new Date(todo.date)}
                  priorityLevel={todo.priorityLevel}
                  onOperationSuccess={triggerRefresh}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
