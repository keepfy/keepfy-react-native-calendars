import React, { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    addDays,
    isSameDay,
    isSameMonth,
    isSameWeek,
    startOfWeek
} from 'date-fns'
import { times } from 'ramda'
import Day, { DayProps } from './Day'

export type WeekProps = Pick<DayProps, 'emitter'> & {
    weekDate: Date
    monthDate: Date
    onDayPress?: (date: Date) => void
    onDayLongPress?: (date: Date) => void
    currentDay?: Date
    selectedDay?: Date
    showExtraDates?: boolean
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        overflow: 'visible'
    }
})

const Week = React.memo((props: WeekProps) => {
    const {
        showExtraDates = true,
        currentDay,
        selectedDay,
        weekDate,
        monthDate,
        emitter
    } = props
    // Avoid re-instantiations or instance changes
    const [month] = useState(monthDate)
    const [initial] = useState(() => startOfWeek(weekDate))

    /*
     * Keep this one isolated here, to avoid re-renders
     * cuz dates shallow comparisons will not work
     * when we instantiate another date
     */
    const days = useMemo(() => times(
        day => addDays(initial, day),
        7
    ), [initial])

    const daysToRender = useMemo(() => days.map(day => {
        const shouldShowExtraDates = showExtraDates
            || isSameMonth(day, month)

        return (
            <Day
                key={ day + '' }
                markedAsCurrent={
                    currentDay && isSameDay(day, currentDay)
                }
                markedAsSelected={
                    selectedDay && isSameDay(day, selectedDay)
                }
                isHidden={ !shouldShowExtraDates }
                day={ day }
                emitter={ emitter }
            />
        )
    }, 7), [
        days,
        showExtraDates,
        month,
        currentDay,
        selectedDay,
        emitter
    ])

    return (
        <View style={ styles.container }>
            { daysToRender }
        </View>
    )
}, (prev, next) => {
    const keys = Object.keys(prev) as (keyof WeekProps)[]

    return keys.reduce((isEq, key) => {
        if(!isEq) {
            return false
        }

        if(!(key in prev && key in next)) {
            return false
        }

        if(key === 'selectedDay' && prev.selectedDay && next.selectedDay) {
            const wasInThisWeek = isSameWeek(prev.selectedDay, prev.weekDate)
            const hasChangedWeek = !isSameWeek(prev.weekDate, next.selectedDay)

            if(wasInThisWeek) {
                if(hasChangedWeek) {
                    // Has changed to a different week
                    return false
                } else {
                    // Render the week again if selected day has changed.
                    return prev.selectedDay === next.selectedDay
                }
            }

            const isInThisWeek = isSameWeek(next.selectedDay, prev.weekDate)
            if(isInThisWeek) {
                // Selected a day on this week.
                return false
            }

            /*
             * Wasn't on this week and is not selecting
             * a day on this week. Nothing to change here.
             */
            return true
        }

        return prev[key] === next[key]
    }, true as boolean)
})

export default Week
