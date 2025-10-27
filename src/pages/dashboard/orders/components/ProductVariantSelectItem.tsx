import { ReactNode } from "react"
import classnames from "classnames"

interface Props {
  selected?: boolean
  name: ReactNode
  onSelect?: () => void
}
export const ProductVariantSelectItem = ({ selected, name, onSelect }: Props) => {
  return (
    <div
      className={classnames(
        "w-full cursor-pointer rounded-md border border-neutral-200 px-3 py-4 text-sm font-medium text-neutral-600 outline-blue-400 transition-colors duration-200 hover:bg-neutral-50",
        {
          "relative !box-border !border-blue-400 outline": selected,
        },
      )}
      onClick={() => onSelect?.()}
    >
      {name}
    </div>
  )
}
