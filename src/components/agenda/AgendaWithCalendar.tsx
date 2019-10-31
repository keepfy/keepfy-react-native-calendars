import React, { useCallback, useEffect, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import AgendaList, { AgendaListProps } from './AgendaList'
import useComponentDimensions from '../../hooks/useComponentDimensions'
import { getWeeksInMonth } from 'date-fns'
import { Surface } from 'react-native-paper'
import Calendar, { CalendarProps } from '../calendar/Calendar'
import { DAY_DIMENS } from '../date/Day'

type Props<T> =
    & CalendarProps
    & AgendaListProps<T>
    & { isCalendarOpen?: boolean }

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

const AnimatedSurface = Animated.createAnimatedComponent(Surface)

function AgendaWithCalendar<T>(props: Props<T>) {
    const weekHeight = 40 // TODO: make this be a prop or be used on week component

    const [listSizes, onListLayout] = useComponentDimensions({
        height: DAY_DIMENS * 6 + weekHeight, // Enough to hide it initially
        width: 0
    })
    const [monthListOpen] = useState(
        () => new Animated.Value(props.isCalendarOpen ? 1 : 0))
    const [currentWeekCount, setCurrentWeekCount] = useState(
        () => getWeeksInMonth(props.initialDate || new Date()))
    const hasExtraWeek = currentWeekCount > 5
    const [bottomWeek] = useState(
        () => new Animated.Value(hasExtraWeek ? 0 : 1))

    useEffect(() => {
        const animation = Animated.spring(monthListOpen, {
            useNativeDriver: true,
            toValue: props.isCalendarOpen ? 1 : 0
        })

        animation.start()

        return () => {
            animation.stop()
        }
    }, [monthListOpen, props.isCalendarOpen])

    useEffect(() => {
        const animation = Animated.spring(bottomWeek, {
            useNativeDriver: true,
            toValue: hasExtraWeek ? 1 : 0
        })

        animation.start()

        return () => {
            animation.stop()
        }
    }, [bottomWeek, hasExtraWeek])

    const handleMonthChange = useCallback((date: Date) => {
        setCurrentWeekCount(getWeeksInMonth(date))
    }, [])

    const headerTranslate = monthListOpen.interpolate({
        inputRange: [0, 1],
        outputRange: [0, listSizes.height]
    })

    const agendaTranslate = monthListOpen.interpolate({
        inputRange: [0, 1],
        outputRange: [
            (hasExtraWeek ? 0 : weekHeight) - listSizes.height,
            0
        ]
    })

    const extraWeekTranslate = bottomWeek.interpolate({
        inputRange: [0, 1],
        outputRange: [weekHeight, 0],
        /*
         * We clamp here to prevent the elevation to be shown
         * as the spring animation will extrapolate
         * the translateY showing it.
         * Note: we only need right clamp, but we can
         * clamp left too, no problemo, it's just not included
         * because it's not necessary
         */
        extrapolateRight: 'clamp'
    })

    const monthListStyle = [{
        elevation: 4,
        /*
         * Due to translations, we need to hide extra weeks till
         * the calendar "resize" happens
         */
        overflow: 'hidden', // TODO: not sure if this works on IOS
        // To make the list use the available space
        bottom: listSizes.height,
        transform: [{
            translateY: Animated.subtract(headerTranslate, extraWeekTranslate)
        }]
    }]

    const agendaListStyle = [{
        transform: [{
            translateY: Animated.subtract(agendaTranslate, extraWeekTranslate)
        }]
    }]

    return (
        <View style={ styles.container }>
            <AnimatedSurface
                style={ monthListStyle }
                onLayout={ onListLayout }>
                <Animated.View
                    style={ {
                        /*
                         * While the parent translate will move things in Y
                         * this will bring them back to their place.
                         * This will basically cancel the parent
                         * translation of the extra week that some months
                         * have
                         */
                        transform: [
                            { translateY: extraWeekTranslate }
                        ]
                    } }>
                    <Calendar
                        showExtraDates={ props.showExtraDates }
                        currentDay={ props.currentDay }
                        selectedDay={ props.selectedDay }
                        initialDate={ props.initialDate }
                        onVisibleMonthChange={ handleMonthChange }
                        emitter={ props.emitter }
                    />
                </Animated.View>
            </AnimatedSurface>
            <Animated.View style={ agendaListStyle }>
                <AgendaList
                    sections={ props.sections }
                    onEndReached={ props.onEndReached }
                    renderItem={ props.renderItem }
                />
            </Animated.View>
        </View>
    )
}

export default AgendaWithCalendar
