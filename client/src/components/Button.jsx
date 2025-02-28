import React from 'react';
import clsx from 'clsx';

const Button = ({icon, type, label, className, onClick = () => {}}) => {
  return (
   <button 
     type={type || "button"} 
     onClick={onClick}
     className={clsx("px-3 py-2 outline-none", className)}>
     
     <span>{label}</span>

     {icon && icon} 
   </button>
  );
};

export default Button;