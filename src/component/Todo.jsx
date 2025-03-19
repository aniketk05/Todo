import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "animate.css/animate.min.css"; // Import Animate.css
import { FaCheckCircle, FaRegCircle, FaSun, FaMoon } from "react-icons/fa"; // Icons for Status and Theme

const Todo = () => {
  const [todo, setTodo] = useState({
    id: "",
    title: "",
    description: "",
    status: false,
    createAt: Date.now(),
    updatedAt: Date.now(),
  });

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedTodo, setSelectedTodo] = useState(null); // For Modal Popup
  const [theme, setTheme] = useState("light"); // Theme state

  // Toggle theme between dark and light
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Apply theme to the body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (todo.id && users.some((user) => user.id === todo.id)) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === todo.id ? { ...todo, updatedAt: Date.now() } : user
        )
      );
    } else {
      setUsers([
        ...users,
        { ...todo, id: uuidv4(), createAt: Date.now(), updatedAt: Date.now() },
      ]);
    }

    setTodo({
      id: "",
      title: "",
      description: "",
      status: false,
      createAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  const handleDelete = (todoToDelete) => {
    setUsers(users.filter((user) => user.id !== todoToDelete.id));
  };

  const handleUpdate = (todoToUpdate) => {
    setTodo(todoToUpdate);
  };

  const handleStatusToggle = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? { ...user, status: !user.status, updatedAt: Date.now() }
          : user
      )
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const filteredUsers = users.filter((todoItem) => {
    if (filter === "completed") return todoItem.status === true;
    else if (filter === "pending") return todoItem.status === false;
    else if (filter === "latest") return true;
    return true;
  });

  const sortedUsers =
    filter === "latest"
      ? filteredUsers.sort((a, b) => b.updatedAt - a.updatedAt)
      : filteredUsers;

  return (
    <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900"}`}>
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-lg ${
            theme === "light" ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" : "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
          } hover:shadow-xl transition duration-300`}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <FaMoon size={24} /> : <FaSun size={24} />}
        </button>
      </div>

      <h2 className="text-4xl font-bold text-center mb-8 animate__animated animate__fadeInDown bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Todo App
      </h2>

      <form className="max-w-2xl mx-auto mb-8 animate__animated animate__fadeInUp">
        <input
          type="text"
          name="title"
          value={todo.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-3 mb-4 rounded-2xl border-2 border-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />
        <textarea
          type="text"
          name="description"
          value={todo.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 mb-4 rounded-2xl border-2 border-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />
        <button
          className={`w-full p-3 rounded-2xl font-semibold ${
            todo.id ? "bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" : "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          } text-white transition duration-300 hover:shadow-xl`}
          onClick={handleClick}
        >
          {todo.id ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div className="max-w-2xl mx-auto mb-6">
        <select
          className="w-full p-3 rounded-2xl border-2 border-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed Tasks</option>
          <option value="pending">Pending Tasks</option>
          <option value="latest">Latest Tasks</option>
        </select>
      </div>

      <div className="max-w-2xl mx-auto">
        {sortedUsers.length > 0 ? (
          sortedUsers.map((todoItem) => (
            <div
              key={todoItem.id}
              className="mb-4 animate__animated animate__fadeIn"
            >
              <div
                className={`p-4 rounded-2xl shadow-lg cursor-pointer flex justify-between items-center transition duration-300 ${
                  theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200"
                } hover:shadow-xl border-2 border-purple-200`}
                onClick={() => setSelectedTodo(todoItem)}
              >
                <div>
                  <h5 className="text-xl font-semibold">{todoItem.title}</h5>
                  <p className="text-gray-500">{todoItem.description}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusToggle(todoItem.id);
                  }}
                  className="p-2 rounded-full hover:bg-purple-200 transition duration-300"
                >
                  {todoItem.status ? (
                    <FaCheckCircle size={24} className="text-green-500" />
                  ) : (
                    <FaRegCircle size={24} className="text-yellow-500" />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 animate__animated animate__fadeIn">
            No tasks available.
          </p>
        )}
      </div>

      {selectedTodo && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelectedTodo(null)}
        >
          <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md animate__animated animate__zoomIn">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">{selectedTodo.title}</h3>
              <p className="text-gray-700 mb-4">{selectedTodo.description}</p>
              <p className="text-gray-600">
                <strong>Created:</strong> {formatDate(selectedTodo.createAt)}
              </p>
              <p className="text-gray-600">
                <strong>Updated:</strong> {formatDate(selectedTodo.updatedAt)}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    selectedTodo.status ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedTodo.status ? "Done" : "Pending"}
                </span>
              </p>
            </div>
            <div className="flex justify-end p-6 space-x-4">
              <button
                className="px-4 py-2 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition duration-300 hover:shadow-xl"
                onClick={() => {
                  handleDelete(selectedTodo);
                  setSelectedTodo(null);
                }}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition duration-300 hover:shadow-xl"
                onClick={() => {
                  handleUpdate(selectedTodo);
                  setSelectedTodo(null);
                }}
              >
                Update
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-br from-gray-500 to-gray-700 text-white rounded-2xl hover:from-gray-600 hover:to-gray-800 transition duration-300 hover:shadow-xl"
                onClick={() => setSelectedTodo(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;