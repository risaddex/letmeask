import { ButtonHTMLAttributes } from "react"

import '../styles/button.scss'

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props:TButtonProps) => {
  return (
    <button className="button" {...props}/>
  )
}