import { useState, useEffect } from "react";
import { storage } from "./storage";

export default function useStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    storage.getItem(key).then(v => {
      if (v !== null) setValue(JSON.parse(v));
    });
  }, [key]);

  useEffect(() => {
    storage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}