import React, { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { addDays, startOfWeek } from 'date-fns'
import Day from './Day'
import { T, times } from 'ramda'
import format, { DateFormats } from '../../lib/format'

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    text: {
        textTransform: 'capitalize'
    }
})

const dayOfWeekName = (day: Date) =>
    format(day, DateFormats.MONTH_WEEK_SHORT)

const WeekDayNames = React.memo(() => {
    const initial = useMemo(() => startOfWeek(new Date()), [])

    const days = useMemo(() =>
        times(day => addDays(initial, day), 7),
    [initial])

    const renderDay = useCallback((day: Date, index: number) => {
        return (
            <Day
                key={ index + '' }
                textStyle={ styles.text }
                day={ day }
                formatter={ dayOfWeekName }
            />
        )
    }, [])

    const weekNamesToRender = useMemo(
        () => days.map(renderDay),
        [days, renderDay]
    )

    return (
        <View style={ styles.container }>
            { weekNamesToRender }
        </View>
    )

    /*
     * Week names don't need re-render unless
     * the formatter changes the locale.
     * For now, we ignore this.
     */
}, T)

export default WeekDayNames
