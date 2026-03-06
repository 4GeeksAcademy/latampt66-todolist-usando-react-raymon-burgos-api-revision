import React, { useState, useEffect } from "react";

const Home = () => {
	// --- ESTADOS ---
	const [userInput, setUserInput] = useState("");
	const [activeUser, setActiveUser] = useState("raymon_burgos");
	
	// Estado que recupera los usuarios guardados
	const [recentUsers, setRecentUsers] = useState(() => {
		const saved = localStorage.getItem("my_todo_users");
		return saved ? JSON.parse(saved) : ["raymon_burgos"];
	});
	
	const [task, setTask] = useState("");
	const [list, setList] = useState([]);

	// Guardar automáticamente los usuarios en el panel con LocalStorage 
	useEffect(() => {
		localStorage.setItem("my_todo_users", JSON.stringify(recentUsers));
	}, [recentUsers]);

	// --FUNCIÓN PARA CREAR USUARIO  ---
	const createUser = async (name) => {
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/users/${name}`, {
				method: "POST", //
				headers: { "Content-Type": "application/json" }
			});
			if (resp.ok) {
				console.log(`Usuario ${name} creado/verificado.`);
				await getTasks(name); 
			}
		} catch (error) { console.error("Error al crear:", error); }
	};

	// ---OBTENER TAREAS (GET) CON AUTO-POST ---
	const getTasks = async (user) => {
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/users/${user}`);
			
			// Si el usuario no existe (404)
			if (resp.status === 404) {
				console.warn("404 detectado: Creando usuario automáticamente...");
				await createUser(user); 
				return;
			}

			if (resp.ok) {
				const data = await resp.json();
				setList(data.todos); //
			}
		} catch (error) { console.error("Error en GET:", error); }
	};

	// --- gestion de usuarios en el panel ---
	const handleSwitchUser = (name) => {
		const target = name || userInput;
		if (!target.trim()) return;
		
		setActiveUser(target);
		if (!recentUsers.includes(target)) {
			setRecentUsers([...recentUsers, target]);
		}
		getTasks(target);
		setUserInput("");
	};

	
	const removeUserFromList = (nameToRemove) => {
		const updatedUsers = recentUsers.filter(user => user !== nameToRemove);
		setRecentUsers(updatedUsers);
		
		
		if (activeUser === nameToRemove) {
			const nextUser = updatedUsers.length > 0 ? updatedUsers[0] : "raymon_burgos";
			setActiveUser(nextUser);
			getTasks(nextUser);
		}
	};

	// ---operaciones y tareas
	const addTask = async (e) => {
		if (e.key === "Enter" && task.trim() !== "") {
			const resp = await fetch(`https://playground.4geeks.com/todo/todos/${activeUser}`, {
				method: "POST", //
				body: JSON.stringify({ label: task, is_done: false }),
				headers: { "Content-Type": "application/json" }
			});
			if (resp.ok) { setTask(""); await getTasks(activeUser); }
		}
	};

	const toggleTask = async (item) => {
		await fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
			method: "PUT", //
			body: JSON.stringify({ label: item.label, is_done: !item.is_done }),
			headers: { "Content-Type": "application/json" }
		});
		await getTasks(activeUser);
	};

	const deleteTask = async (id) => {
		const resp = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, { method: "DELETE" }); //
		if (resp.ok) await getTasks(activeUser);
	};

	
	const clearAll = async () => {
		const resp = await fetch(`https://playground.4geeks.com/todo/users/${activeUser}`, { method: "DELETE" }); //
		if (resp.ok) {
			setList([]);
			await getTasks(activeUser); 
		}
	};

	useEffect(() => { getTasks(activeUser); }, []);

	return (
		<div className="container mt-5" style={{ maxWidth: "600px" }}>
			<h1 className="text-center display-1 text-danger opacity-25">Todo App</h1>
			
			{/* INPUT DE USUARIOS */}
			<div className="input-group mb-3 shadow-sm">
				<input 
					type="text" className="form-control" 
					placeholder="Nombre de usuario..."
					value={userInput} onChange={(e) => setUserInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSwitchUser()}
				/>
				<button className="btn btn-primary" onClick={() => handleSwitchUser()}>Cargar/Crear</button>
			</div>

			{/* PANEL DE USUARIOS ACTIVO*/}
			<div className="mb-4">
				<p className="text-muted small mb-1">Usuarios activos (haz clic para cambiar):</p>
				<div className="d-flex flex-wrap gap-2">
					{recentUsers.map((u) => (
						<div key={u} className="btn-group shadow-sm">
							<button 
								onClick={() => handleSwitchUser(u)}
								className={`btn btn-sm ${activeUser === u ? "btn-danger" : "btn-outline-secondary"}`}
							>
								{u}
							</button>
							{/* X PARA QUITAR EL USUARIO QUE CREE DEL PANEL*/}
							<button 
								className={`btn btn-sm ${activeUser === u ? "btn-danger" : "btn-outline-secondary"}`}
								style={{ borderLeft: "1px solid rgba(255,255,255,0.2)" }}
								onClick={() => removeUserFromList(u)}
							>
								&times;
							</button>
						</div>
					))}
				</div>
			</div>

			
			<div className="card shadow">
				<div className="card-header bg-white border-0 pt-3">
					<h5 className="mb-0">Lista de: <span className="text-danger">{activeUser}</span></h5>
				</div>
				<input
					type="text" className="form-control form-control-lg border-0 border-top"
					placeholder="¿Qué hay que hacer?"
					value={task} onChange={(e) => setTask(e.target.value)} onKeyDown={addTask}
				/>
				<ul className="list-group list-group-flush">
					{list.map((item) => (
						<li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
							<div className="d-flex align-items-center">
								<input 
									type="checkbox" className="form-check-input me-3" 
									checked={item.is_done} onChange={() => toggleTask(item)} 
								/>
								<span style={{ textDecoration: item.is_done ? "line-through" : "none", color: item.is_done ? "gray" : "black" }}>
									{item.label}
								</span>
							</div>
							<button className="btn text-danger border-0" onClick={() => deleteTask(item.id)}>✕</button>
						</li>
					))}
				</ul>
				<div className="card-footer d-flex justify-content-between bg-white">
					<span className="text-muted small">{list.length} tareas</span>
					<button className="btn btn-link btn-sm text-danger text-decoration-none" onClick={clearAll}>
						Limpiar todo de {activeUser}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;