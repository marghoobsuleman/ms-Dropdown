import React from 'react';
export interface MsDropdownOptionProps {
    text: string;
    value: string;
    image?: string;
    description?: string;
    className?: string;
    title?: string;
    imageCss?: string;
}
export interface MsDropdownReactProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options?: MsDropdownOptionProps[];
    value?: string | string[];
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    name?: string;
    className?: string;
    disabled?: boolean;
    multiple?: boolean;
    required?: boolean;
    imagePosition?: string;
    showFilterAlways?: boolean;
}
declare const MsDropdownReact: React.FC<MsDropdownReactProps>;
export default MsDropdownReact;
