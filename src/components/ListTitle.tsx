const ListTitle = ({ editName, isDisabled, updateListName, listName }) => {
	return (
		<form onSubmit={editName}>
			<input
				readOnly={isDisabled}
				style={
					isDisabled
						? {
								outline: 'none',
								borderWidth: 0,
								backgroundColor: 'transparent',
								width: '100%',
								fontSize: '28px',
						  }
						: {
								backgroundColor: 'white',
								borderWidth: '2px',
								width: '100%',
								fontSize: '28px',
						  }
				}
				onChange={updateListName}
				value={listName}
			></input>
			<button type="submit">{isDisabled ? 'Edit' : 'Save'}</button>
		</form>
	);
};

export default ListTitle;
