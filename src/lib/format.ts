import rawFormat from 'date-fns/format'
import pt from 'date-fns/locale/pt'
import { parseISO } from 'date-fns'

export enum DateFormats {
    MONTH_WEEK_SHORT = 'eee',
    MONTH_NAME_AND_YEAR = 'MMMM - yyyy',
}

const format = (
    date: Date | string,
    formatStr: DateFormats
) => {
    // date-fns/blob/master/docs/upgradeGuide.md#string-arguments
    const normalized = typeof date === 'string'
        ? parseISO(date)
        : date

    return rawFormat(normalized, formatStr, {
        locale: pt
    })
}

export default format
