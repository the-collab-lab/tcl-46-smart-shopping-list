// add styling to error msg
export default function NoTokenWelcome({
	updateListName,
	makeNewList,
	joinListSubmit,
	listName,
	joinListChange,
	joinListToken,
	errorMessage,
}) {
	return (
		<>
			<h1 className="Home__heading">Home</h1>
			<form className="form__list no-token" onSubmit={makeNewList}>
				<label htmlFor="make-list" className="label__input__primary">
					<input
						id="make-list"
						type="text"
						className="input__primary no-token"
						placeholder="Type new list name"
						onChange={updateListName}
						value={listName}
					/>
				</label>
				<button className="btn__primary no-token" type="submit">
					Start New List
				</button>
			</form>
			<form className="form__list no-token" onSubmit={joinListSubmit}>
				<label htmlFor="share-list" className="label__input__primary">
					<input
						id="share-list"
						type="text"
						className="input__primary no-token"
						placeholder="Type list token"
						pattern="(?:\w+ ){2}\w+"
						title="Token must be three words separated with spaces."
						onChange={joinListChange}
						value={joinListToken}
					></input>
				</label>
				<button className="btn__primary no-token" type="submit">
					Join a List
				</button>
			</form>
			{errorMessage && <p className="error">{errorMessage}</p>}
		</>
	);
}
