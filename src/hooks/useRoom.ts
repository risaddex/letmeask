import { useState, useEffect } from 'react';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

export type TFirebaseQuestion = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type TQuestion = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export const useRoom = (roomId: string) => {
  const { user } = useAuth();
  const [roomTitle, setRoomTitle] = useState('');
  const [questions, setQuestions] = useState<TQuestion[]>([]);

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
            likeCount: Object.values(questionData.likes ?? {}).length,
            likeId: Object.entries(questionData.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
            ...questionData,
          };
        }
      );

      setRoomTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      roomRef.off('value');
    };
  }, [roomId, user?.id]);

  return { questions, roomTitle };
};
