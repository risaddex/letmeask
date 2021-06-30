import logoImg from '../assets/images/logo.svg';

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button';
import { Question } from '../components/Question';

import { useParams } from 'react-router-dom';
import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss';

type TRoomParams = {
  id: string;
};

export type TFirebaseQuestion = Record<
  string,
  {
    author: {
      name:string;
      avatar:string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
  }
>;

type TQuestion = {
  id: string;
  author: {
    name:string;
    avatar:string;
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
};

export const Room = () => {
  const { user } = useAuth();
  const params = useParams<TRoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const [questions, setQuestions] = useState<TQuestion[]>([]);

  const roomId = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    //! on bigger applications, its better to handle logic using 'child_n' events
    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: TFirebaseQuestion = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, questionData]) => {
          return {
            id: key,
            ...questionData,
          };
        }
      );

      setRoomTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
    console.log(roomId);
  }, [roomId]);

  const handleSendQuestion = async (e: FormEvent) => {
    e.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {roomTitle}</h1>

          {questions.length > 0 && <span> {questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="O que você quer perguntar?"
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu Login</button>
              </span>
            )}
            <Button disabled={!user} type="submit">
              Enviar pergunta
            </Button>
          </div>
        </form> 
        
        <div className="question-list">
        {questions.map(question => (
          <Question
            content={question.content}
            author={question.author}
            key={question.id}
          />
        ))}
        </div>

      </main>
    </div>
  );
};
