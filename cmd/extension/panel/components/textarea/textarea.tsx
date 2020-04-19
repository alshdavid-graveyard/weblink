import './textarea.scss'
import React from 'react'
import { useClassName } from '../../hooks'
import { Assign } from '../../../../../platform/types'


export type TextareaProps = Assign<React.TextareaHTMLAttributes<HTMLTextAreaElement>, {
  onInput: (data: any) => any
}>

export const TextArea = ({
  onInput = () => {},
  ...props
}: TextareaProps) => {
  const className = useClassName({
    'component-textarea': true,
    [props.className]: !!props.className,
  })

  function onInputProxy(e: any) {
    onInput(e.target.value)
    if (props.onChange) {
      props.onChange(e)
    }
  }

  return <textarea
    {...props}
    className={className}
    onInput={onInputProxy}
  />
}