import dayjs from "dayjs"

export const dateFormat = "YYYY-MM-DD"

export const DEFAULT_DATE_RANGE = {
  from: dayjs().subtract(1, "month").format(dateFormat),
  to: dayjs().format(dateFormat),
}
