import React, { useState, useEffect } from "react";

const Home = () => {
	const [userInput, setUserInput] = useState("raymon_burgos"); // Nombre por defecto
	const [task, setTask] = useState("");
	const [list, setList] = useState([]);

	
	const createUser = async () => {
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/users/${userInput}`, {
				method: "POST", // Operación POST de 'User operations'
				headers: { "Content-Type": "application/json" }
			});
			if (resp.ok) {
				alert(`Usuario ${userInput} creado o verificado`);
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
				setList([]); // Si no existe, limpiamos la lista visualmente
				console.warn("El usuario no existe en la API.");
				return;
			}
			if (resp.ok) {
				const data = await resp.json();
				setList(data.todos); // Traemos sus tareas específicas
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	
	const addTask = async (e) => {
		if (e.key === "Enter" && task.trim() !== "") {
			try {
				const resp = await fetch(`https://playground.4geeks.com/todo/todos/${userInput}`, {
					method: "POST",
					body: JSON.stringify({ label: task, is_done: false }),
					headers: { "Content-Type": "application/json" }
				});
				if (resp.ok) {
					setTask("");
					await getTasks();
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

    

	useEffect(() => {
		getTasks();
	}, []);

	return (
		<div className="container mt-5">
			<h1 className="text-center display-1 text-danger opacity-25">Todo App</h1>
			
			{/* --- NUEVA SECCIÓN: GESTIÓN DE USUARIOS --- */}
			<div className="d-flex mb-4 shadow-sm p-3 bg-light rounded">
				<input 
					type="text" 
					className="form-control me-2" 
					placeholder="Nombre de usuario..."
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
				/>
				<button className="btn btn-primary me-2" onClick={createUser}>Crear</button>
				<button className="btn btn-secondary" onClick={getTasks}>Cargar</button>
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
						<li className="list-group-item text-muted text-center py-4">
							Usuario "{userInput}" sin tareas pendientes.
						</li>
					) : (
						list.map((item) => (
							<li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
								<span>{item.label}</span>
								<button className="btn btn-outline-danger btn-sm border-0" onClick={() => deleteTask(item.id)}>✕</button>
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
};

export default Home;