import React, { useState, useEffect } from "react";

const Home = () => {
	const [task, setTask] = useState("");
	const [list, setList] = useState([]);
	const user = "raymon_burgos"; // llave usuario creado

	
	const getTasks = async () => {
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/users/${user}`);
			if (resp.ok) {
				const data = await resp.json();
				setList(data.todos);
				console.log("--- [GET] Lista sincronizada desde el servidor ---");
			}
		} catch (error) {
			console.error("Error al obtener tareas:", error);
		}
	};

	
	const addTask = async (e) => {
		if (e.key === "Enter" && task.trim() !== "") {
			try {
				const resp = await fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
					method: "POST",
					body: JSON.stringify({ label: task, is_done: false }),
					headers: { "Content-Type": "application/json" }
				});
				if (resp.ok) {
					setTask(""); 
					await getTasks(); 
					console.log("--- [POST] Nueva tarea guardada en la API ---");
				}
			} catch (error) {
				console.error("Error al añadir:", error);
			}
		}
	};

	
	const toggleTask = async (item) => {
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
				method: "PUT",
				body: JSON.stringify({ 
					label: item.label, 
					is_done: !item.is_done 
				}),
				headers: { "Content-Type": "application/json" }
			});
			if (resp.ok) {
				await getTasks();
				console.log("--- [PUT] Estado de tarea actualizado ---");
			}
		} catch (error) {
			console.error("Error al actualizar estado:", error);
		}
	};

	
	const deleteTask = async (id) => {
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
				method: "DELETE"
			});
			if (resp.ok) {
				await getTasks();
				console.log("--- [DELETE] Tarea eliminada del servidor ---");
			}
		} catch (error) {
			console.error("Error al borrar:", error);
		}
	};

	
	const clearAllTasks = async () => {
		try {
			const respDelete = await fetch(`https://playground.4geeks.com/todo/users/${user}`, {
				method: "DELETE"
			});
			if (respDelete.ok) {
				
				await fetch(`https://playground.4geeks.com/todo/users/${user}`, { method: "POST" });
				setList([]);
				console.warn("--- [LIMPIEZA] Usuario reiniciado con éxito ---");
			}
		} catch (error) {
			console.error("Error en limpieza total:", error);
		}
	};

	useEffect(() => {
		getTasks();
	}, []);

	return (
		<div className="container mt-5">
			<h1 className="text-center display-1 text-danger opacity-25">tareas</h1>
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
						<li className="list-group-item text-muted text-center py-4">
							No hay tareas, añade una nueva
						</li>
					) : (
						list.map((item) => (
							<li key={item.id} className="list-group-item d-flex justify-content-between align-items-center task-item">
								<div className="d-flex align-items-center">
									<input 
										type="checkbox" 
										className="form-check-input me-3"
										checked={item.is_done}
										onChange={() => toggleTask(item)}
									/>
									<span style={{ 
										textDecoration: item.is_done ? "line-through" : "none",
										color: item.is_done ? "#adb5bd" : "black"
									}}>
										{item.label}
									</span>
								</div>
								<button 
									className="btn btn-outline-danger btn-sm border-0 opacity-50" 
									onClick={() => deleteTask(item.id)}
								>
									✕
								</button>
							</li>
						))
					)}
				</ul>
				<div className="card-footer d-flex justify-content-between align-items-center text-muted small bg-white py-3">
					<span>{list.filter(t => !t.is_done).length} tareas pendientes</span>
					<button 
						className="btn btn-link btn-sm text-danger text-decoration-none" 
						onClick={clearAllTasks}
					>
						Borrar todo
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;