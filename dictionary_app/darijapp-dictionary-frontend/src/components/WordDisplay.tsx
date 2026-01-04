interface WordDisplayProps {
    children: React.ReactNode,
    isSelected: boolean
}

function WordDisplay({children, isSelected} : WordDisplayProps) {
    const getClassName = () => {
        if (isSelected) {
            return "word word-selected";
        }
        else {
            return "word"
        }
    }

    return (
        <div className={getClassName()}>
            {children}
        </div>
    );
}

export default WordDisplay;