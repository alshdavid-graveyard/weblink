import './navbar-item.scss'
import React from "react"
import { useClassName } from '../../hooks'

export type NavbarItemProps = {
  children?: any,
  isSelected?: boolean,
  type?: 'flat' | 'round',
  onClick?: () => any,
}

export const NavbarItem = ({ 
  children, 
  isSelected = false,
  type = 'flat',
  onClick = () => {},
}: NavbarItemProps) => {
  const className = useClassName({
    'component-navbar-item': true,
    'is-selected': isSelected,
    [type]: true,
  })
  return <div 
    onClick={onClick}
    className={className}>
    {children}
  </div>
}

