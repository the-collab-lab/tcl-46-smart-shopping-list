export function AddItem() {
	return (
		<div>
			<p>
				Hello from the <code>/add-item</code> page!
			</p>
			<form onSubmit={() => {}}>
				<label for="item">
					Add Item
					<input placeholder="my form" id="addItem" />
				</label>
				<select>
					<option value={7}>Soon</option>
					<option value={14}>Kind of Soon</option>
					<option value={30}>Not Soon</option>
				</select>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
