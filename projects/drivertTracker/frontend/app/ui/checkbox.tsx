import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Pressable } from "react-native";
import { Check } from "lucide-react-native";

export type CheckboxProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
};

const Checkbox = forwardRef(({ checked = false, onCheckedChange, className = "" }: CheckboxProps, ref) => {
  const [internalChecked, setInternalChecked] = useState(checked);

  useImperativeHandle(ref, () => ({
    toggle: () => {
      const newState = !internalChecked;
      setInternalChecked(newState);
      onCheckedChange?.(newState);
    },
  }));

  const handlePress = () => {
    const newState = !internalChecked;
    setInternalChecked(newState);
    onCheckedChange?.(newState);
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`h-5 w-5 rounded-sm border border-primary items-center justify-center 
        ${internalChecked ? "bg-primary" : "bg-white"} 
        ${className}`}
    >
      {internalChecked && <Check size={16} color="white" />}
    </Pressable>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
