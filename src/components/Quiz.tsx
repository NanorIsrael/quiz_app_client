import { useEffect, useState } from 'react';
import { useApi } from '../data/ApiProvider';
import CheckboxGroup from './CheckboxGroup';

interface QuizType {
  question: string;
  answer_options: string[];
  question_number: Number;
}

export interface ResponseType {
  ok: boolean;
  errors: {
    error: '';
  };
}
export interface QuizResponseType extends ResponseType {
  quizQuestion: QuizType
  cusor: {
    hasNext: boolean,
    currentIndex: number,
    totalNumber: number
    }
}

export default function Quiz() {
  const [questionIndex, setQuestionIndex] = useState<number | null>(1);
  const [cursor, setCursor] = useState({
        hasNext: false,
        currentIndex: 1,
        totalNumber: 0
  });
  const [selectedOption, setSelectedOption] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(
    undefined as QuizType | undefined | null,
  );
  const [, setError] = useState({
    error: '',
  });
  const api = useApi();

  useEffect(() => {
    (async () => {
      const response = await api.get<QuizResponseType>(
        '/quiz/question/?index=' + questionIndex,
      );
      if (response.body?.ok) {
        setCurrentQuestion(response.body?.quizQuestion as QuizType);
        setCursor(response.body?.cusor);
      } else {
        setCurrentQuestion(null);
        // setQuestionIndex(null)
      }
      if (response.body?.errors) {
        setError(response.body?.errors);
      }
    })();
  }, [api, questionIndex]);

  const handleOptionChange = (option: string) => {
      console.log(cursor.hasNext)
      
        setSelectedOption(option);
      
  };

    const handleCurrentQuestion = () => {
        if (cursor.hasNext) {
            setQuestionIndex((prev) => prev ? prev + 1 : null);
        } else {
            
        }
    };

  return (
    <div className="App">
      <h1 className="App-header">What do you Know?</h1>
      <main>
        {currentQuestion === undefined ? (
          <p>Loading</p>
        ) : currentQuestion === null ? (
          <p>Could not retrieve quiz questions</p>
        ) : (
          <>
            {currentQuestion && (
              <section>
                <p>
                  <span>{'' + currentQuestion.question_number}.</span> &nbsp;
                  {currentQuestion.question}
                </p>
                <CheckboxGroup
                  options={currentQuestion.answer_options}
                  selectedOption={selectedOption}
                  onOptionChange={handleOptionChange}
                />
              </section>
            )}
            <button onClick={handleCurrentQuestion}>{cursor.hasNext ? 'Next' : 'Done'}</button>
          </>
        )}
      </main>
    </div>
  );
}
