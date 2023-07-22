import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  quizQuestion: QuizType;
  cusor: {
    hasNext: boolean;
    currentIndex: number;
    totalNumber: number;
  };
}

export default function Quiz({
  setScore,
}: {
  setScore: (score: number) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState<number>(1);
  const [cursor, setCursor] = useState({
    hasNext: false,
    currentIndex: 1,
    totalNumber: 0,
  });
  const [selectedOption, setSelectedOption] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(
    undefined as QuizType | undefined | null,
  );
  const [, setError] = useState({
    error: '',
  });
  const api = useApi();
  const navigate = useNavigate();

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
      }
      if (response.body?.errors) {
        setError(response.body?.errors);
      }
      if (questionIndex === 1) {
        localStorage.setItem('answeredQuestions', '[]');
      }
    })();
  }, [api, questionIndex]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleCurrentQuestion = async () => {
    if (currentQuestion) {
      const quizQuestions: AnsweredQuestions[] =
        (JSON.parse(
          localStorage.getItem('answeredQuestions')!,
        ) as AnsweredQuestions[]) || [];

      quizQuestions.push({
        ...currentQuestion,
        selectedAnswer: selectedOption,
        questionNumber: questionIndex,
      });

      localStorage.setItem('answeredQuestions', JSON.stringify(quizQuestions));
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption('');

      if (!cursor.hasNext) {

        const response = await api.post<QuizBody, any>('/quiz', {
          quizQuestions,
          status: 1,
        });

        if (response.ok) {
          setSelectedOption('');
          localStorage.setItem('answeredQuestions', '[]');
          setScore(response.body.score as number);
          navigate('/user/score');
        }
      }
    }
  };

  return (
    <div className="App">
      <h1 className="App-header py-7 underline">What do you Know?</h1>
      <main className="App_main py-7">
        {currentQuestion === undefined ? (
          <p>Loading</p>
        ) : currentQuestion === null ? (
          <p>Could not retrieve quiz questions</p>
        ) : (
          <>
            {currentQuestion && (
              <section className="m-2">
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
            <button
              onClick={handleCurrentQuestion}
              disabled={selectedOption === ''}
              className={
                'bg-black p-2 w-4/12 text-white m-4 hover:text-yellow-600'
              }
            >
              {cursor.hasNext ? 'Next' : 'Done'}
            </button>
          </>
        )}
      </main>
    </div>
  );
}

interface AnsweredQuestions extends QuizType {
  selectedAnswer: string;
  questionNumber: number;
}

interface QuizBody {
  quizQuestions: AnsweredQuestions[];
  status: number;
}
