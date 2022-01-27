import React, { useEffect, useState } from "react";


const ENDPOINT = "http://localhost:1263/api/todos";

const App = () => {
	const [value, setValue] = useState("");
	const [todos, setTodos] = useState([

	useEffect(() => {
		fetch(ENDPOINT)
			.then((response) => response.json())
			.then(data => {
				setTodos(data);
			});
	}, [])
	return (
		<div>
			<h1>{value}</h1>
			<form
				onSubmit={event_ => {
					event_.preventDefault();
					fetch(ENDPOINT, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ name: value }),
					})
						.then((response) => response.json())
						.then(data => {
					setTodos([...todos, data]);
						});
					setValue("");
				}}
			>
				<input
					type="text"
					value={value}
					onChange={event_ => {
						setValue(event_.target.value);
					}}
				/>
				<button disabled={!value} type="submit">
					Add
				</button>
			</form>
			<ul>
				{todos.map((todo, index) => {
					return (
						<li key={todo.id}>
							<label>
								<input
									type="checkbox"
									checked={todo.isChecked}
									onChange={() => {
										fetch(ENDPOINT, {
											method: 'PUT',
											headers: { 'Content-Type': 'application/json',
										},
										body: JSON.stringify({
											id: todo.id,
											update: {isChecked: !todo.isChecked },
										}),

									})
										.then(response => response.json())
										.then(data => {

										const update = [...todos];
										update[index] = data;
										setTodos(update);
										});
									}}
								/>
								<span
									style={{
										textDecoration: todo.isChecked ? "line-through" : "none",
									}}
								>
									{todo.name}
								</span>
							</label>
							<button
								onClick={() => {
									fetch(ENDPOINT, {
										method: "DELETE",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({ id: todo.id }),
									}).then(() => {
										const update = [...todos];
										update.splice(index, 1);
										setTodos(update);
									});
								}}
							>
								Delete
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default App;
