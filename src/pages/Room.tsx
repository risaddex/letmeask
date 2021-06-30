import logoImg from '../assets/images/logo.svg'

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button'

import '../styles/room.scss';
import { useParams } from 'react-router-dom';

type TRoomParams = {
  id:string;
}
 
export const Room = () => {
  const params = useParams<TRoomParams>();


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
        <RoomCode code={params.id} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala react</h1>

          <span >4 perguntas</span>
        </div>

        <form>
          <textarea
            placeholder="O que você quer perguntar?"
          />

          <div className="form-footer">
            <span>Para enviar uma pergunta, <button>faça seu Login</button></span>
            <Button type="submit">Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  )
}