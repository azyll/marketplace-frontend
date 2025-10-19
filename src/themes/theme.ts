// theme.ts
import { Button, createTheme } from "@mantine/core"

export const theme = createTheme({
  breakpoints: {
    xs: "36rem",
    sm: "40rem",
    md: "48rem",
    lg: "64rem",
    xl: "80rem",
  },

  fontFamily: "Inter, sans-serif",

  components: {
    Button: Button.extend({
      styles: {
        root: {
          borderWidth: 0,
        },
      },
    }),
  },
})
