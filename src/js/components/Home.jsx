import React, { useState } from "react";

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    return (
        <div className="container mt-5" style={{ width: "500px" }}>
            <h1 className="text-center display-1 opacity-25" style={{ color: "red" }}>todos</h1>
            <div className="card shadow">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <input
                            type="text"
                            className="form-control border-0 fs-4"
                            placeholder="What needs to be done?"
                            onChange={(e) => setInputValue(e.target.value)}
                            value={inputValue}
                            onKeyDown={(e) => {
                                
                                if (e.key === "Enter" && inputValue.trim() !== "") {
                                    setTodos([...todos, inputValue.trim()]);
                                    setInputValue(""); 
                                }
                            }}
                        />
                    </li>
                    {}
                    {todos.map((task, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center task-item py-3">
                            {task}
                            <span 
                                className="text-danger delete-icon" 
                                onClick={() => setTodos(todos.filter((_, i) => i !== index))}
                            >
                                <i className="fa-solid fa-xmark">X</i>
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="card-footer text-muted bg-white p-2" style={{ fontSize: "14px" }}>
                    {}
                    {todos.length === 0 
                        ? "dime algo o morire" 
                        : `${todos.length} item${todos.length > 1 ? "s" : ""} left`}
                </div>
            </div>
        </div>
    );
};

export default Home;