import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
    FlatList, LayoutAnimation,
    ListRenderItemInfo,
    StyleSheet,
    View, ViewProps,
    ViewToken
} from 'react-native'
import Month, { MonthProps } from '../date/Month'
import { addMonths, startOfMonth, subMonths } from 'date-fns'
import { times } from 'ramda'
import { ActivityIndicator } from 'react-native-paper'
import CalendarHeader from './CalendarHeader'

export type CalendarProps = Pick<
    MonthProps,
    | 'currentDay'
    | 'selectedDay'
    | 'showExtraDates'
    | 'emitter'
> & {
    initialDayDate?: Date
    minPastMonths?: number
    maxFutureMonths?: number
    onVisibleMonthChange?: (date: Date) => void
    initialNumberToRender?: number
    forceExtraWeekInAll?: boolean
    measuredWidth?: number
}

const styles = StyleSheet.create({
    widthMeasureContainer: {
        width: '100%',
        minHeight: 60
    },
    monthContainer: {
        position: 'relative'
    },
    loadContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
    }
})

const keyExtractor = (_: unknown, index: number) => index + ''

const Calendar = React.memo((props: CalendarProps) => {
    const {
        minPastMonths = 12,
        maxFutureMonths = 12,
        onVisibleMonthChange
    } = props
    const ref = useRef<FlatList<Date> | null>(null)
    const [measuredWidth, setMeasuredWidth] = useState(props.measuredWidth || -1)
    const [initial] = useState(
        () => startOfMonth(props.initialDayDate || new Date()))
    const [past] = useState(
        () => subMonths(initial, minPastMonths))

    // Could we use a pull-stream here?
    const range = useMemo(() => times(
        index => addMonths(past, index),
        minPastMonths + maxFutureMonths
    ), [maxFutureMonths, minPastMonths, past])

    const handleMonthChange = useCallback((index: number) => {
        if(ref.current && (index >= 0 && index < range.length)) {
            ref.current.scrollToIndex({
                animated: true,
                index: index
            })
        }
    }, [range.length])

    const renderMonth = useCallback(({ item, index }: ListRenderItemInfo<Date>) => (
        <View
            style={ [styles.monthContainer, { width: measuredWidth }] }>
            <CalendarHeader
                onArrowPress={ handleMonthChange }
                index={ index }
                monthDate={ item }
            />
            <Month
                showExtraDates={ props.showExtraDates }
                currentDay={ props.currentDay }
                selectedDay={ props.selectedDay }
                monthDate={ item }
                emitter={ props.emitter }
                forceExtraWeek={ props.forceExtraWeekInAll }
            />
        </View>
    ), [
        measuredWidth,
        handleMonthChange,
        props.forceExtraWeekInAll,
        props.showExtraDates,
        props.currentDay,
        props.selectedDay,
        props.emitter
    ])

    const getItemDimensions = useCallback((_: Date[] | null, index: number) => ({
        index: index,
        length: measuredWidth,
        offset: index * measuredWidth
    }), [measuredWidth])

    const onViewableItemsChanged = useCallback(({
        viewableItems
    }: { viewableItems: Array<ViewToken> }) => {
        if(!viewableItems || !viewableItems[0]) {
            return
        }

        const { item } = (viewableItems[0] as unknown as { item: Date })
        if(onVisibleMonthChange) {
            onVisibleMonthChange(item)
        }
    }, [onVisibleMonthChange])

    const handleSize: ViewProps['onLayout'] = event => {
        if(measuredWidth <= 0) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setMeasuredWidth(event.nativeEvent.layout.width)
        }
    }

    const renderList = () => {
        if(measuredWidth <= 0) {
            return (
                <View style={ styles.loadContainer }>
                    <ActivityIndicator size='small' />
                </View>
            )
        }

        return (
            <FlatList
                ref={ ref }
                horizontal
                pagingEnabled
                viewabilityConfig={ { itemVisiblePercentThreshold: 40 } }
                initialNumToRender={ props.initialNumberToRender || 4 }
                maxToRenderPerBatch={ 4 }
                onViewableItemsChanged={ onViewableItemsChanged }
                initialScrollIndex={ minPastMonths }
                keyExtractor={ keyExtractor }
                data={ range }
                renderItem={ renderMonth }
                getItemLayout={ getItemDimensions }
                showsHorizontalScrollIndicator={ false }
            />
        )
    }

    return (
        <View
            style={ styles.widthMeasureContainer }
            onLayout={ handleSize }>
            { renderList() }
        </View>
    )
})

export default Calendar
