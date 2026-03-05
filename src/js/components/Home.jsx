import React, { useState, useEffect } from "react";

const Home = () => {
    const [userInput, setUserInput] = useState("raymon_burgos");
    const [task, setTask] = useState("");
    const [list, setList] = useState([]);

    
    const createUser = async () => {
        try {
            const resp = await fetch(`https://playground.4geeks.com/todo/users/${userInput}`, {
                method: "POST", //
                headers: { "Content-Type": "application/json" }
            });
            if (resp.ok) {
                alert(`Usuario "${userInput}" listo.`);
                await getTasks();
            }
        } catch (error) {
            console.error("Error al crear:", error);
        }
    };

    
    const getTasks = async () => {
        try {
            const resp = await fetch(`https://playground.4geeks.com/todo/users/${userInput}`);
            if (resp.status === 404) {
                setList([]);
                console.warn("Usuario no existe. Usa el botón 'Crear'."); //
                return;
            }
            if (resp.ok) {
                const data = await resp.json();
                setList(data.todos); //
            }
        } catch (error) {
            console.error("Error al cargar:", error);
        }
    };

    
    const addTask = async (e) => {
        if (e.key === "Enter" && task.trim() !== "") {
            try {
                const resp = await fetch(`https://playground.4geeks.com/todo/todos/${userInput}`, {
                    method: "POST", //
                    body: JSON.stringify({ label: task, is_done: false }),
                    headers: { "Content-Type": "application/json" }
                });
                if (resp.ok) {
                    setTask("");
                    await getTasks();
                }
            } catch (error) {
                console.error("Error al añadir:", error);
            }
        }
    };

    
    const toggleTask = async (item) => {
        try {
            const resp = await fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
                method: "PUT", //
                body: JSON.stringify({ 
                    label: item.label, 
                    is_done: !item.is_done //
                }),
                headers: { "Content-Type": "application/json" }
            });
            if (resp.ok) await getTasks();
        } catch (error) {
            console.error("Error al actualizar:", error);
        }
    };

    
    const deleteTask = async (id) => {
        try {
            const resp = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: "DELETE" //
            });
            if (resp.ok) {
                await getTasks(); // Refresca la lista tras eliminar
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    return (
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
            <h1 className="text-center display-1 text-danger opacity-25">Todo App</h1>
            
            {/* Gestión de Usuario */}
            <div className="input-group mb-3 shadow-sm">
                <input 
                    type="text" 
                    className="form-control" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button className="btn btn-primary" onClick={createUser}>Crear User</button>
                <button className="btn btn-outline-secondary" onClick={getTasks}>Cargar</button>
            </div>

            <div className="card shadow">
                <input
                    type="text"
                    className="form-control form-control-lg border-0"
                    placeholder="¿Qué hay que hacer?"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyDown={addTask}
                />
                <ul className="list-group list-group-flush">
                    {list.length === 0 ? (
                        <li className="list-group-item text-muted text-center py-4">No hay tareas.</li>
                    ) : (
                        list.map((item) => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input me-3"
                                        checked={item.is_done}
                                        onChange={() => toggleTask(item)}
                                    />
                                    <span style={{ textDecoration: item.is_done ? "line-through" : "none" }}>
                                        {item.label}
                                    </span>
                                </div>
                                <button 
                                    className="btn btn-link text-danger p-0 border-0" 
                                    onClick={() => deleteTask(item.id)}
                                >
                                    ✕
                                </button>
                            </li>
                        ))
                    )}
                </ul>
                <div className="card-footer text-muted small bg-white">
                    {list.length} ítems en total
                </div>
            </div>
        </div>
    );
};

export default Home;