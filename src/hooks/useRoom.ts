import { useState, useEffect } from 'react';
import { database } from '../services/firebase';

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


export const useRoom = (roomId:string) => {
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
            ...questionData,
          };
        }
      );

      setRoomTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
    console.log(roomId);
  }, [roomId]);

  return {questions, roomTitle};
}