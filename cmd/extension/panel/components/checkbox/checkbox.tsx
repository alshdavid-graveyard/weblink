import './checkbox.scss'
import React, { useState } from 'react'
import { useClassName } from '../../hooks'
import { Assign } from '~/platform/types'

export type CheckboxProps = Assign<React.HTMLAttributes<HTMLDivElement>, {
  onCheck?: (value: boolean) => any
  defaultValue?: boolean
}>

export const Checkbox = ({
  onCheck = () => {},
  defaultValue = false,
  ...props
}: CheckboxProps) => {
  const [ checked, setChecked ] = useState(defaultValue)

  const className = useClassName({
    'component-checkbox': true,
    'is-checked': checked,
    [props.className]: !!props.className,
  })

  function onClickProxy(e: any) {
    const update = !checked
    setChecked(update)
    onCheck(update)
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return <div
    {...props}
    className={className}
    onClick={onClickProxy}
  />
}