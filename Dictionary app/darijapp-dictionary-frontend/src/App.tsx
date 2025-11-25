import FrenchExpressionCreation from './components/FrenchExpressionCreation';
import FrenchExpressionsList from './components/FrenchExpressionsList';
import ArabicExpressionsList from './components/ArabicExpressionsList';
import ArabicExpressionCreation from './components/ArabicExpressionCreation';

function App() {
  return (
    <>
      {/* <div>
        <ArabicExpressionsList />
      </div>
      <div>
        <ArabicExpressionCreation selectedWord={null} />
      </div> */}
      <div>
        <ArabicExpressionCreation selectedWord={null} showTranslationsMenu={true} linkedFrenchExpressionId={null} />
      </div>
    </>
  )
}

export default App
