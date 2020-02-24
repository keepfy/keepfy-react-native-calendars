import rawFormat from 'date-fns/format'
import pt from 'date-fns/locale/pt'
import { parseISO } from 'date-fns'

export enum DateFormats {
    WEEK_DAY_MONTH_DESCRIPTIVE = 'eee\',\' d \'de\' MMM',
    YEAR = 'yyyy',
    MONTH_OF_YEAR = 'MMMM \'de\' yyyy',
    MONTH_WEEK_SHORT = 'eee'
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
