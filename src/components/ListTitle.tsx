import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import '../views/List.css';

const ListTitle = ({ editName, isDisabled, updateListName, listName }) => {
	return (
		<form onSubmit={editName} className="ListTitle">
			<input
				readOnly={isDisabled}
				className="ListTitle__input"
				style={
					isDisabled
						? {
								outline: 'none',
								borderWidth: 0,
						  }
						: {
								borderWidth: '3px',
						  }
				}
				onChange={updateListName}
				value={listName}
			></input>
			<button className={isDisabled ? 'btn__edit' : 'btn__save'} type="submit">
				{isDisabled ? <FontAwesomeIcon icon={faPencil} /> : 'Save'}
			</button>
		</form>
	);
};

export default ListTitle;
