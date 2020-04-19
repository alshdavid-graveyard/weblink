import './dot.scss'
import React from 'react'
import { useClassName } from '../../hooks'
import { Assign } from '../../../../../platform/types'

export type DotProps = Assign<React.HTMLAttributes<HTMLDivElement>, {
  isSet: boolean
  size?: number,
}>

export const Dot = ({
  isSet = false,
  size = 12,
  ...props
}: DotProps) => {
  const className = useClassName({
    'component-dot': true,
    'is-set': isSet,
    [props.className]: !!props.className,
  })

  return <div
    {...props}
    style={{ height: `${size}px`, width: `${size}px` }}
    className={className}
  />
}