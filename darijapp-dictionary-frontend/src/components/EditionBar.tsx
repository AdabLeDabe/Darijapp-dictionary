interface EditionBarProps {
    isEditMode: boolean
    addCallback: () => void,
    returnCallBack: () => void
}

function EditionBar({isEditMode, addCallback, returnCallBack}: EditionBarProps) {
    return (<>
        <div className="edition-bar-container">
            {isEditMode
            ? (<button onClick={() => returnCallBack()}>Back</button>)
            : (<button onClick={() => addCallback()}>Add</button>)}
        </div>
    </>);
}

export default EditionBar;