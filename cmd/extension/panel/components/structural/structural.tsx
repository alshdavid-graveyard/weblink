import './structural.scss'
import React from 'react'
import { useClassName } from '../../hooks'
import { Assign } from '../../../../../platform/types'

export type FlexProps = Assign<React.HTMLAttributes<HTMLDivElement>, {
  align?: 'vertical' | 'horizontal'
}>

export const Flex = ({
  align,
  className = '',
  ...props
}: FlexProps) => <div 
  {...props}
  className={useClassName({
    'component-flex': true,
    'vertical': align === 'vertical',
    'horizontal': align === 'horizontal',
    [className]: !!className,
  })} />

export type ColProps = Assign<React.HTMLAttributes<HTMLDivElement>, {
}>

export const Col = ({
  className = '',
  ...props
}: ColProps) => <div
  {...props} 
  className={useClassName({
    'component-col': true,
    [className]: !!className,
  })} />

  export type ContentProps = Assign<React.HTMLAttributes<HTMLDivElement>, {
  }>
  
  export const Content = ({
    className = '',
    ...props
  }: ContentProps) => <div
    {...props} 
    className={useClassName({
      'component-content': true,
      [className]: !!className,
    })} />