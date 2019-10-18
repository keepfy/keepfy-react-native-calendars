import React, { useMemo, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import {
    addWeeks,
    getWeeksInMonth,
    isSameMonth,
    startOfMonth
} from 'date-fns'
import { times } from 'ramda'
import Week, { WeekProps } from './Week'
import WeekDayNames from './WeekDayNames'

export type MonthProps = Pick<
    WeekProps,
    | 'currentDay'
    | 'selectedDay'
    | 'showExtraDates'
    | 'emitter'
> & {
    style?: StyleProp<ViewStyle>
    monthDate: Date
    width: number
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
        paddingHorizontal: 8
    }
})

const Month = React.memo((props: MonthProps) => {
    // To avoid new instances or re-instantiations
    const [monthStart] = useState(() => startOfMonth(props.monthDate))
    const [weekCount] = useState(() => getWeeksInMonth(monthStart))

    /*
     * Keep this one isolated here, to avoid re-renders
     * cuz dates shallow comparisons will not work
     * when we instantiate another date
     */
    const weeks = useMemo(() => times(
        number => addWeeks(monthStart, number),
        weekCount
    ), [monthStart, weekCount])

    const weeksToRender = useMemo(() => weeks.map((weekDate, i) => {
        return (
            <Week
                key={ i + '' }
                currentDay={ props.currentDay }
                selectedDay={ props.selectedDay }
                monthDate={ monthStart }
                weekDate={ weekDate }
                showExtraDates={ props.showExtraDates }
                emitter={ props.emitter }
            />
        )
    }, weekCount), [
        monthStart,
        props.emitter,
        props.selectedDay,
        props.currentDay,
        props.showExtraDates,
        weekCount,
        weeks
    ])

    return (
        <View style={ [
            styles.container,
            { width: props.width },
            StyleSheet.flatten(props.style)
        ] }>
            <WeekDayNames key='day-names' />
            { weeksToRender }
        </View>
    )
}, (prev, next) => {
    const keys = Object.keys(prev) as (keyof MonthProps)[]

    return keys.reduce((isEq, key) => {
        if(!isEq) {
            return false
        }

        if(!(key in prev && key in next)) {
            return false
        }

        if(key === 'selectedDay' && prev.selectedDay && next.selectedDay) {
            const wasInThisMonth = isSameMonth(prev.selectedDay, prev.monthDate)
            const hasChangedMonth = !isSameMonth(prev.monthDate, next.selectedDay)

            if(wasInThisMonth) {
                if(hasChangedMonth) {
                    // Has changed to a different month
                    return false
                } else {
                    // Render the month again if selected day has changed.
                    return prev.selectedDay === next.selectedDay
                }
            }

            const isInThisMonth = isSameMonth(next.selectedDay, prev.monthDate)
            if (isInThisMonth) {
                // Selected a day on this month.
                return false
            }

            /*
             * Wasn't on this month and is not selecting
             * a day on this month. Nothing to change here.
             */
            return true
        }

        return prev[key] === next[key]
    }, true as boolean)
})

export default Month
