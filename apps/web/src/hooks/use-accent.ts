import { Theme } from "@web/src/lib/theme"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

const accentAtom = atomWithStorage<Theme["name"]>("accent", "zinc")

export function useAccent() {
  return useAtom(accentAtom)
}
