import './input.scss'
import React from 'react'
import { useClassName } from '../../hooks'
import { Assign } from '../../../../../platform/types'

export type InputProps = Assign<React.InputHTMLAttributes<HTMLInputElement>, {
  onInput?: (data: any) => any
}>

export const Input = ({
  onInput = () => {},
  ...props
}: InputProps) => {
  const className = useClassName({
    'component-input': true,
    [props.className]: !!props.className,
  })

  function onInputProxy(e: any) {
    onInput(e.target.value)
    if (props.onChange) {
      props.onChange(e)
    }
  }

  return <input
    {...props}
    className={className}
    onChange={onInputProxy}
  />
}