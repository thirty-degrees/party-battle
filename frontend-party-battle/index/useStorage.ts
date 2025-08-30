import { useState, useEffect } from "react";
import { storage } from "./storage";

export default function useStorage(key: string) {
  const [value, setValue] = useState<string>("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    storage.getItem(key).then(v => {
      if (!active) return;
      if (v !== null) setValue(v);
      setLoading(false);
    });
    return () => { active = false };
  }, [key]);

  useEffect(() => {
    if (!isLoading && value && value.trim() !== "") {
      storage.setItem(key, value);
    }
  }, [key, value, isLoading]);

  return [value, setValue, isLoading] as const;
}