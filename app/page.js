"use client"

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const {setTheme} = useTheme();
  return (
    <div>
      <h2>Hello guys, How are you?</h2>
      <Button>Click me</Button>
      <Button onClick={() => setTheme('dark')}>Dark Mode</Button>
      <Button onClick={() => setTheme('light')}>Light Mode</Button>
    </div>
  );
}
