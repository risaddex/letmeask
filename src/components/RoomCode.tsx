import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss';

type TRoomCodeProps = {
  code: string;
}
export const RoomCode = (props: TRoomCodeProps) => {
  const copyRoomCodeToClipBoard = () => {
    navigator.clipboard.writeText(props.code)
  }
  return (
    <button className="room-code" onClick={copyRoomCodeToClipBoard}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>sala #{props.code}</span>
    </button>
  )
}