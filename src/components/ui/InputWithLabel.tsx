
import { InputHTMLAttributes, ReactNode } from "react";

interface InputWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon?: ReactNode;
}

export function InputWithLabel({ id, label, icon, ...props }: InputWithLabelProps) {
  return (
    <div className="space-y-1">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-care-500 focus:ring-care-500 sm:text-sm ${
            icon ? "pl-10" : "pl-4"
          } py-2 border`}
          {...props}
        />
      </div>
    </div>
  );
}
