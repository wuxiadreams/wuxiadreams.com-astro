import "easymde/dist/easymde.min.css";
import { useMemo } from "react";
import type { SimpleMDEReactProps } from "react-simplemde-editor";
import SimpleMdeReact from "react-simplemde-editor";

export default function MdEditor(props: SimpleMDEReactProps) {
  const { value, onChange, options, ...rest } = props;
  const memoizedOptions = useMemo(() => {
    return {
      spellChecker: false,
      hideIcons: ["guide", "fullscreen", "side-by-side"] as any,
      ...options,
    };
  }, [options]);

  return (
    <SimpleMdeReact
      {...rest}
      value={value}
      onChange={onChange}
      options={memoizedOptions}
    />
  );
}
