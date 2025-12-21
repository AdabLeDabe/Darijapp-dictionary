interface EditionBarProps {
    hasSelectedItem: boolean
}

function EditionBar({hasSelectedItem: hasSelectedItem}: EditionBarProps) {
    return (<>
        <div className="edition-bar-container">
            <button>Add</button>
        </div>
    </>);
}

export default EditionBar;